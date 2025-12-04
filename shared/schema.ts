import { pgTable, text, varchar, integer, boolean, timestamp, customType } from "drizzle-orm/pg-core";
import { z } from "zod";

// Custom bytea type for image storage
const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

// ----------------- IMAGES -----------------
export const images = pgTable("images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  filename: text("filename").notNull(),
  data: bytea("data").notNull(),
  mimetype: text("mimetype").notNull(),
});

// ----------------- USERS -----------------
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Insert schema
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ----------------- PRODUCTS -----------------
export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  imageId: integer("image_id").notNull(),
  category: text("category").notNull(),
  color: text("color"),
  length: integer("length"),
  isBestSeller: boolean("is_best_seller").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schema compatible with AdminPanel (Node.js safe)
export const insertProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  image: z.any().refine((val) => val && (val instanceof Buffer ? val.length > 0 : val.size > 0), "Image is required"),
  category: z.enum(["abaya", "scarf", "jallabiya"], {
    message: "Please select a category",
  }),
  color: z.string().optional().default(""),
  length: z.coerce.number().optional(),
  isBestSeller: z.boolean().default(false),
});

// Update schema (partial, no image field for updates)
export const updateProductSchema = insertProductSchema.partial().omit({ image: true });

// Types
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Product = typeof products.$inferSelect;

// Category labels for display
export type Category = "abaya" | "scarf" | "jallabiya";
export const categoryLabels: Record<Category, string> = {
  abaya: "Abaya",
  scarf: "Scarf",
  jallabiya: "Jallabiya",
};
