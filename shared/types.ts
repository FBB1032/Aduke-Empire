// Type definitions for shared use between client and server
// These are extracted from schema.ts to avoid bundling zod in the client

export type User = {
  id: string;
  username: string;
  password: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  imageId: number;
  category: string;
  color?: string;
  size?: string;
  isBestSeller: boolean;
  createdAt: Date;
};

export type Category = "abaya" | "scarf" | "jallabiya";

export const categoryLabels: Record<Category, string> = {
  abaya: "Abaya",
  scarf: "Scarf",
  jallabiya: "Jallabiya",
};
