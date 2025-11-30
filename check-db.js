import { db } from "./server/db.ts";
import { images, products } from "./shared/schema.ts";

async function checkDB() {
  try {
    const imageCount = await db.select().from(images);
    const productCount = await db.select().from(products);

    console.log(`Images in DB: ${imageCount.length}`);
    console.log(`Products in DB: ${productCount.length}`);

    if (imageCount.length === 0) {
      console.log("No images found - need to reseed");
    } else {
      console.log("Images exist - checking first few:");
      imageCount.slice(0, 3).forEach((img, i) => {
        console.log(`  Image ${i+1}: ID=${img.id}, filename=${img.filename}, size=${img.data.length} bytes`);
      });
    }
  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    process.exit(0);
  }
}

checkDB();
