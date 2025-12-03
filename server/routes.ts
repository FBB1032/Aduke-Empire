import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage } from "./dbStorage";
import { insertProductSchema, updateProductSchema } from "@shared/schema";
import multer from "multer";
import bcrypt from "bcrypt";

// ---------------- MULTER SETUP ----------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- SESSION TYPES ----------------
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

// ---------------- ROUTES ----------------
export async function registerRoutes(app: Express) {
  
  // ---------- AUTH ----------
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt:", { username });

      if (!username || !password)
        return res.status(400).json({ error: "Username and password are required" });

      const normalizedUsername = username.toLowerCase().trim();
      console.log("Normalized username:", normalizedUsername);

      const user = await dbStorage.getUserByUsername(normalizedUsername);
      console.log("Found user:", !!user);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      console.log("Password matches:", passwordMatches);

      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.isAdmin = true;
      console.log("Session after login:", req.session);

      res.json({ success: true, message: "Logged in successfully" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: "Failed to logout" });
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    res.json({ authenticated: !!req.session.isAdmin });
  });

  // ---------- AUTH MIDDLEWARE ----------
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.isAdmin) return res.status(401).json({ error: "Unauthorized" });
    next();
  };

  // ---------- PRODUCTS ----------
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
    } catch (err) {
      console.error("Get products error:", err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // ---------- GET BESTSELLERS ----------
  app.get("/api/products/bestsellers", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await dbStorage.getBestSellers(limit);
      res.json(products);
    } catch (err) {
      console.error("Get bestsellers error:", err);
      res.status(500).json({ error: "Failed to fetch bestsellers" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

      const product = await dbStorage.getProductById(id);
      if (!product) return res.status(404).json({ error: "Product not found" });

      res.json(product);
    } catch (err) {
      console.error("Get product error:", err);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // ---------- CREATE PRODUCT ----------
  app.post("/api/products", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { name, price, category, color, size, isBestSeller } = req.body;
      const imageBuffer = req.file?.buffer;

      const parsed = insertProductSchema.safeParse({
        name,
        price: Number(price),
        category,
        color,
        size,
        isBestSeller: isBestSeller === "true",
        image: imageBuffer,
      });

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }

      const product = await dbStorage.createProduct(parsed.data);
      res.status(201).json(product);
    } catch (err) {
      console.error("Create product error:", err);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // ---------- UPDATE PRODUCT ----------
  app.patch("/api/products/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

      const { name, price, category, color, size, isBestSeller } = req.body;
      const imageBuffer = req.file?.buffer;

      const updateData: any = {
        name,
        price: price ? Number(price) : undefined,
        category,
        color,
        size,
        isBestSeller: isBestSeller ? isBestSeller === "true" : undefined,
      };

      if (imageBuffer) {
        const image = await dbStorage.createImage({
          filename: req.file!.originalname || "product-image",
          data: imageBuffer,
          mimetype: req.file!.mimetype,
        });
        updateData.imageId = image.id;
      }

      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      const parsed = updateProductSchema.safeParse(updateData);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

      const updated = await dbStorage.updateProduct(id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Product not found" });

      res.json(updated);
    } catch (err) {
      console.error("Update product error:", err);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // ---------- DELETE PRODUCT ----------
  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

      const deleted = await dbStorage.deleteProduct(id);
      if (!deleted) return res.status(404).json({ error: "Product not found" });

      res.json({ success: true, message: "Product deleted" });
    } catch (err) {
      console.error("Delete product error:", err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ---------- IMAGE ROUTES ----------
  app.get("/api/images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid image ID" });

      const image = await dbStorage.getImageById(id);
      if (!image) return res.status(404).json({ error: "Image not found" });

      res.set("Content-Type", image.mimetype);
      res.send(image.data);
    } catch (err) {
      console.error("Get image error:", err);
      res.status(500).json({ error: "Failed to fetch image" });
    }
  });

}
