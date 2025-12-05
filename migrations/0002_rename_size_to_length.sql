-- Rename size column to length in products table
ALTER TABLE "products" RENAME COLUMN "size" TO "length";
-- Change the type to integer if it's not already
ALTER TABLE "products" ALTER COLUMN "length" TYPE integer USING length::integer;
--> statement-breakpoint
