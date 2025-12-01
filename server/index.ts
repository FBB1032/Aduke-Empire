import express from "express";
import { createServer } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import path from "path";
import { db } from "./db.js";
import { sql } from "drizzle-orm";
import { registerRoutes } from "./routes.js";
import "dotenv/config";

const app = express();
const PORT = 5002;
const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://aduke-empire-production.up.railway.app/']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
let sessionStore;
try {
  const PgSession = connectPgSimple(session);
  sessionStore = new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'session',
    createTableIfMissing: true,
  });
} catch (error) {
  console.log('Database not available, using memory store for sessions');
  const MemoryStore = require('memorystore')(session);
  sessionStore = new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });
}

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
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
