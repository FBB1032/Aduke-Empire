import { eq, desc, sql, and, ilike, gte, lte } from "drizzle-orm";
import { db } from "./db";
import { users, products, images } from "@shared/schema";
import type { User, InsertUser, Product, InsertProduct, UpdateProduct } from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // ---------------- USERS ----------------
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const normalized = username.toLowerCase().trim();
    const [user] = await db
      .select()
      .from(users)
      .where(sql`lower(${users.username}) = ${normalized}`);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const [user] = await db.insert(users).values({ ...insertUser, id }).returning();
    return user;
  }

  // ---------------- PRODUCTS ----------------
  async getProducts(
    category?: string,
    page: number = 1,
    limit: number = 12,
    filters?: { search?: string; minPrice?: number; maxPrice?: number; color?: string; length?: number }
  ): Promise<{ products: Product[]; total: number }> {
    const conditions = [] as any[];

    if (category) conditions.push(eq(products.category, category));
    if (filters?.search) conditions.push(ilike(products.name, `%${filters.search}%`));
    if (filters?.minPrice !== undefined) conditions.push(gte(products.price, filters.minPrice));
    if (filters?.maxPrice !== undefined) conditions.push(lte(products.price, filters.maxPrice));
    if (filters?.color) conditions.push(eq(products.color, filters.color));
    if (filters?.length !== undefined) conditions.push(eq(products.length, filters.length));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(products).where(whereClause);
    const total = countResult?.count || 0;

    const offset = (page - 1) * limit;
    const productList = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return { products: productList, total };
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getBestSellers(limit: number = 8): Promise<Product[]> {
    return db.select().from(products).where(eq(products.isBestSeller, true)).limit(limit);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // First, create the image
    const image = await this.createImage({
      filename: "product-image",
      data: product.image,
      mimetype: "image/jpeg",
    });

    const { image: _, ...productData } = product;

    const [newProduct] = await db.insert(products).values({ ...productData, imageId: image.id }).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: UpdateProduct): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    productsByCategory: { category: string; count: number }[];
    bestSellersCount: number;
  }> {
    const [totalResult] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
    const categoryStats = await db
      .select({ category: products.category, count: sql<number>`count(*)::int` })
      .from(products)
      .groupBy(products.category);
    const [bestSellersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.isBestSeller, true));

    return {
      totalProducts: totalResult?.count || 0,
      productsByCategory: categoryStats,
      bestSellersCount: bestSellersResult?.count || 0,
    };
  }

  async getUniqueColors(): Promise<string[]> {
    const result = await db.selectDistinct({ color: products.color }).from(products).where(sql`${products.color} IS NOT NULL`);
    return result.map(r => r.color).filter((c): c is string => c !== null);
  }

  async getUniqueSizes(): Promise<string[]> {
    const result = await db.selectDistinct({ length: products.length }).from(products).where(sql`${products.length} IS NOT NULL`);
    return result.map(r => String(r.length)).filter((s): s is string => s !== null);
  }

  // ---------------- IMAGES ----------------
  async createImage(image: { filename: string; data: Buffer; mimetype: string }): Promise<{ id: number }> {
    const [newImage] = await db.insert(images).values(image).returning({ id: images.id });
    return newImage;
  }

  async getImageById(id: number): Promise<{ id: number; filename: string; data: Buffer; mimetype: string } | undefined> {
    const [image] = await db.select().from(images).where(eq(images.id, id));
    return image;
  }
}

export const dbStorage = new DatabaseStorage();
