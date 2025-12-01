import { db } from "./db";
import { users, products, images } from "@shared/schema";
import { sql, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import "dotenv/config";



  const sampleProducts = [
    {
      name: "Luxury Black Abaya",
      price: 35000,
      imageId: 1,
      category: "abaya",
      color: "Black",
      size: "M",
      isBestSeller: true,
    },
    {
      name: "Elegant Navy Abaya",
      price: 38000,
      imageId: 2,
      category: "abaya",
      color: "Navy Blue",
      size: "L",
      isBestSeller: true,
    },
    {
      name: "Classic White Abaya",
      price: 32000,
      imageId: 3,
      category: "abaya",
      color: "White",
      size: "S",
      isBestSeller: false,
    },
    {
      name: "Embroidered Cream Abaya",
      price: 45000,
      imageId: 4,
      category: "abaya",
      color: "Cream",
      size: "M",
      isBestSeller: true,
    },
    {
      name: "Premium Silk Scarf",
      price: 12000,
      imageId: 5,
      category: "scarf",
      color: "Burgundy",
      size: "One Size",
      isBestSeller: true,
    },
    {
      name: "Chiffon Floral Scarf",
      price: 8000,
      imageId: 6,
      category: "scarf",
      color: "Floral Print",
      size: "One Size",
      isBestSeller: false,
    },
    {
      name: "Cotton Hijab Set",
      price: 15000,
      imageId: 7,
      category: "scarf",
      color: "Assorted",
      size: "One Size",
      isBestSeller: true,
    },
    {
      name: "Luxe Satin Scarf",
      price: 10000,
      imageId: 8,
      category: "scarf",
      color: "Emerald Green",
      size: "One Size",
      isBestSeller: false,
    },
    {
      name: "Traditional Gold Jallabiya",
      price: 55000,
      imageId: 9,
      category: "jallabiya",
      color: "Gold",
      size: "L",
      isBestSeller: true,
    },
    {
      name: "Modern Maroon Jallabiya",
      price: 48000,
      imageId: 10,
      category: "jallabiya",
      color: "Maroon",
      size: "M",
      isBestSeller: false,
    },
    {
      name: "Festive Emerald Jallabiya",
      price: 52000,
      imageId: 11,
      category: "jallabiya",
      color: "Emerald",
      size: "XL",
      isBestSeller: true,
    },
    {
      name: "Royal Purple Jallabiya",
      price: 60000,
      imageId: 12,
      category: "jallabiya",
      color: "Purple",
      size: "L",
      isBestSeller: false,
    },
  ];

async function seed() {
  console.log("Seeding database...");

  // Delete all existing users first
  await db.delete(users);
  console.log("Deleted all existing users");

  // Always seed admin user
  const adminId = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash("password123", 10);
  await db.insert(users).values({
    id: adminId,
    username: "fahdbadamasi320@gmail.com".toLowerCase().trim(),
    password: hashedPassword,
  });
  console.log("Admin user created with email: fahdbadamasi320@gmail.com");

  // Clear existing data to ensure clean reseed
  await db.delete(products);
  await db.delete(images);
  console.log("Cleared existing products and images");

  // No images created for best sellers - they will show as broken/missing images

  await db.insert(products).values(sampleProducts);
  console.log(`${sampleProducts.length} products seeded`);

  console.log("Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  });
