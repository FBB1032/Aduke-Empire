import { db } from "./db";
import { users, products, images } from "@shared/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample products
const sampleProducts = [
  {
    name: "Luxury Black Abaya",
    price: 35000,
    imageFile: "abaya1.jpg",
    category: "abaya",
    color: "Black",
    size: "M",
    isBestSeller: true,
  },
  {
    name: "Elegant Navy Abaya",
    price: 38000,
    imageFile: "abaya2.jpg",
    category: "abaya",
    color: "Navy Blue",
    size: "L",
    isBestSeller: true,
  },
  // ... add the rest of your products similarly
];

async function seed() {
  console.log("Seeding database...");

  // Clear previous data
  await db.delete(users);
  await db.delete(products);
  await db.delete(images);
  console.log("Cleared users, products, and images");

  // Create admin user
  const adminId = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash("Ajuju777", 12);
  await db.insert(users).values({
    id: adminId,
    username: "Suleimanwasila873@gmail.com".toLowerCase().trim(),
    password: hashedPassword,
  });
  console.log("Admin user created with updated credentials");

  // Insert images and products
  for (const prod of sampleProducts) {
    // Read image file from local folder
    const imagePath = path.join(__dirname, "seed-images", prod.imageFile);
    if (!fs.existsSync(imagePath)) {
      console.warn(`Image file not found: ${prod.imageFile}, skipping`);
      continue;
    }
    const data = fs.readFileSync(imagePath);

    // Insert image
    const [newImage] = await db.insert(images).values({
      filename: prod.imageFile,
      data,
      mimetype: "image/jpeg",
    }).returning({ id: images.id });

    // Insert product with imageId
    await db.insert(products).values({
      name: prod.name,
      price: prod.price,
      category: prod.category,
      color: prod.color,
      size: prod.size,
      isBestSeller: prod.isBestSeller,
      imageId: newImage.id,
    });
  }

  console.log("Products and images seeded");
  console.log("Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
