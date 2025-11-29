import { type User, type InsertUser, type Product, type InsertProduct, type UpdateProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(
    category?: string,
    page?: number,
    limit?: number,
    filters?: {
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      color?: string;
      size?: string;
    }
  ): Promise<{ products: Product[]; total: number }>;
  getProductById(id: number): Promise<Product | undefined>;
  getBestSellers(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  getProductStats?(): Promise<{
    totalProducts: number;
    productsByCategory: { category: string; count: number }[];
    bestSellersCount: number;
  }>;
  getUniqueColors?(): Promise<string[]>;
  getUniqueSizes?(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<number, Product>;
  private productIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.productIdCounter = 1;
    
    this.initializeAdmin();
    this.initializeSampleProducts();
  }

  private initializeAdmin(): void {
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin@adukesempire.com",
      password: "admin123",
    });
  }

  private initializeSampleProducts(): void {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Luxury Black Abaya",
        price: 35000,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        category: "abaya",
        color: "Black",
        size: "M",
        isBestSeller: true,
      },
      {
        name: "Elegant Navy Abaya",
        price: 38000,
        image: "https://images.unsplash.com/photo-1590654879707-9a62ad10c5b4?q=80&w=800&auto=format&fit=crop",
        category: "abaya",
        color: "Navy Blue",
        size: "L",
        isBestSeller: true,
      },
      {
        name: "Classic White Abaya",
        price: 32000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
        category: "abaya",
        color: "White",
        size: "S",
        isBestSeller: false,
      },
      {
        name: "Embroidered Cream Abaya",
        price: 45000,
        image: "https://images.unsplash.com/photo-1585486386606-e95f8e4d95f4?q=80&w=800&auto=format&fit=crop",
        category: "abaya",
        color: "Cream",
        size: "M",
        isBestSeller: true,
      },
      {
        name: "Premium Silk Scarf",
        price: 12000,
        image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=800&auto=format&fit=crop",
        category: "scarf",
        color: "Burgundy",
        size: "One Size",
        isBestSeller: true,
      },
      {
        name: "Chiffon Floral Scarf",
        price: 8000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
        category: "scarf",
        color: "Floral Print",
        size: "One Size",
        isBestSeller: false,
      },
      {
        name: "Cotton Hijab Set",
        price: 15000,
        image: "https://images.unsplash.com/photo-1602810316693-3667c854239a?q=80&w=800&auto=format&fit=crop",
        category: "scarf",
        color: "Assorted",
        size: "One Size",
        isBestSeller: true,
      },
      {
        name: "Luxe Satin Scarf",
        price: 10000,
        image: "https://images.unsplash.com/photo-1606907214106-93c7d65f0bd4?q=80&w=800&auto=format&fit=crop",
        category: "scarf",
        color: "Emerald Green",
        size: "One Size",
        isBestSeller: false,
      },
      {
        name: "Traditional Gold Jallabiya",
        price: 55000,
        image: "https://images.unsplash.com/photo-1585486386606-e95f8e4d95f4?q=80&w=800&auto=format&fit=crop",
        category: "jallabiya",
        color: "Gold",
        size: "L",
        isBestSeller: true,
      },
      {
        name: "Modern Maroon Jallabiya",
        price: 48000,
        image: "https://images.unsplash.com/photo-1590654879707-9a62ad10c5b4?q=80&w=800&auto=format&fit=crop",
        category: "jallabiya",
        color: "Maroon",
        size: "M",
        isBestSeller: false,
      },
      {
        name: "Festive Emerald Jallabiya",
        price: 52000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
        category: "jallabiya",
        color: "Emerald",
        size: "XL",
        isBestSeller: true,
      },
      {
        name: "Royal Purple Jallabiya",
        price: 60000,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        category: "jallabiya",
        color: "Purple",
        size: "L",
        isBestSeller: false,
      },
    ];

    sampleProducts.forEach((product) => {
      const id = this.productIdCounter++;
      this.products.set(id, {
        ...product,
        id,
        createdAt: new Date(),
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(
    category?: string,
    page: number = 1,
    limit: number = 12
  ): Promise<{ products: Product[]; total: number }> {
    let products = Array.from(this.products.values());
    
    if (category) {
      products = products.filter((p) => p.category === category);
    }
    
    products.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    const total = products.length;
    const start = (page - 1) * limit;
    const paginatedProducts = products.slice(start, start + limit);
    
    return { products: paginatedProducts, total };
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getBestSellers(limit: number = 8): Promise<Product[]> {
    const bestSellers = Array.from(this.products.values())
      .filter((p) => p.isBestSeller)
      .slice(0, limit);
    return bestSellers;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = {
      ...product,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: UpdateProduct): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = {
      ...existing,
      ...updates,
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();
