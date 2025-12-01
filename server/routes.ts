import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage } from "./dbStorage";
import { insertProductSchema, updateProductSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({ storage });

declare module "express-session" {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
  }
}

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Normalize input (lowercase emails/usernames)
      const normalizedUsername = username.toLowerCase().trim();

      let user;
      try {
        user = await dbStorage.getUserByUsername(normalizedUsername);
      } catch (dbError) {
        console.error("Database error during login:", dbError);
        // Fallback: hardcoded admin credentials when DB is unavailable
        if (normalizedUsername === "admin@adukesempire.com" && password === "password123") {
          console.log("Using fallback authentication due to database unavailability");
          req.session.userId = "fallback-admin";
          req.session.isAdmin = true;
          return res.json({ success: true, message: "Logged in successfully (fallback mode)" });
        }
        return res.status(500).json({ error: "Authentication service temporarily unavailable" });
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.isAdmin = true;

      res.json({ success: true, message: "Logged in successfully" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    res.json({ authenticated: !!req.session.isAdmin });
  });

  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const search = req.query.search as string | undefined;
      const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
      const color = req.query.color as string | undefined;
      const size = req.query.size as string | undefined;
      
      const filters = { search, minPrice, maxPrice, color, size };
      const result = await dbStorage.getProducts(category, page, limit, filters);
      res.json(result);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/bestsellers", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await dbStorage.getBestSellers(limit);
      res.json(products);
    } catch (error) {
      console.error("Get bestsellers error:", error);
      res.status(500).json({ error: "Failed to fetch bestsellers" });
    }
  });

  app.get("/api/products/filters", async (req, res) => {
    try {
      const [colors, sizes] = await Promise.all([
        dbStorage.getUniqueColors(),
        dbStorage.getUniqueSizes(),
      ]);
      res.json({ colors, sizes });
    } catch (error) {
      console.error("Get filters error:", error);
      res.status(500).json({ error: "Failed to fetch filters" });
    }
  });

  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const stats = await dbStorage.getProductStats();
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await dbStorage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { name, price, category, color, size, isBestSeller } = req.body;
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const productData = {
        name,
        price: parseInt(price),
        category,
        color: color || "",
        size: size || "",
        isBestSeller: isBestSeller === "true",
        image: imageFile,
      };

      // Validate without image since it's handled separately
      const parsed = insertProductSchema.omit({ image: true }).safeParse({
        name: productData.name,
        price: productData.price,
        category: productData.category,
        color: productData.color,
        size: productData.size,
        isBestSeller: productData.isBestSeller,
      });
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid product data",
          details: parsed.error.errors
        });
      }

      const product = await dbStorage.createProduct(productData as any);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const { name, price, category, color, size, isBestSeller } = req.body;
      const imageFile = req.file;

      const updateData: any = {
        name,
        price: price ? parseInt(price) : undefined,
        category,
        color,
        size,
        isBestSeller: isBestSeller ? isBestSeller === "true" : undefined,
      };

      // If a new image was uploaded, create it and update imageId
      if (imageFile) {
        const image = await dbStorage.createImage({
          filename: imageFile.originalname || "product-image",
          data: imageFile.buffer,
          mimetype: imageFile.mimetype,
        });
        updateData.imageId = image.id;
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const parsed = updateProductSchema.safeParse(updateData);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid product data",
          details: parsed.error.errors
        });
      }

      const product = await dbStorage.updateProduct(id, parsed.data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const deleted = await dbStorage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ success: true, message: "Product deleted" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Image upload endpoint
  app.post("/api/upload", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { buffer, originalname, mimetype } = req.file;
      const image = await dbStorage.createImage({
        filename: originalname,
        data: Buffer.from(buffer),
        mimetype,
      });
      res.json({ id: image.id });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Image serving endpoint
  app.get("/api/images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid image ID" });
      }

      const image = await dbStorage.getImageById(id);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }

      res.set("Content-Type", image.mimetype);
      res.send(image.data);
    } catch (error) {
      console.error("Get image error:", error);
      res.status(500).json({ error: "Failed to fetch image" });
    }
  });

  return httpServer;
}
