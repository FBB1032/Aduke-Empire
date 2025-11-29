import { db } from "./db";
import { users, products } from "@shared/schema";
import { sql } from "drizzle-orm";

const sampleProducts = [
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

async function seed() {
  console.log("Seeding database...");

  const existingProducts = await db.select({ id: products.id }).from(products).limit(1);
  if (existingProducts.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  const adminId = crypto.randomUUID();
  await db.insert(users).values({
    id: adminId,
    username: "admin@adukesempire.com",
    password: "admin123",
  });
  console.log("Admin user created");

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
