import type { User, InsertUser, Product, InsertProduct, UpdateProduct } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
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
  updateProduct(id: number, updates: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  getProductStats(): Promise<{
    totalProducts: number;
    productsByCategory: { category: string; count: number }[];
    bestSellersCount: number;
  }>;

  getUniqueColors(): Promise<string[]>;
  getUniqueSizes(): Promise<string[]>;

  // Images
  createImage(image: { filename: string; data: Buffer; mimetype: string }): Promise<{ id: number }>;
  getImageById(id: number): Promise<{ id: number; filename: string; data: Buffer; mimetype: string } | undefined>;
}