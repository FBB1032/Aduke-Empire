import express from "express";
import { createServer } from "http";
import session from "express-session";
import path from "path";
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import { registerRoutes } from "./routes.js";
import "dotenv/config";

const app = express();
const PORT = 5002;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Create HTTP server
const httpServer = createServer(app);

// Register API routes
registerRoutes(httpServer, app);

// Serve static files from dist
app.use(express.static(path.join(process.cwd(), "dist")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Catch-all route for React + Wouter routing
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

// Example API route
app.get("/api/test", async (req, res) => {
  try {
    const result = await db.execute(sql`SELECT 1`);
    res.json({ success: true, result: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});

async function startServer() {
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
