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
const PORT = process.env.PORT || 5002;

// Fix __dirname in ESM
const __dirname = path.resolve();

// --------------------
// CORS
// --------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Important: allows cookies to be sent
  })
);

// --------------------
// JSON & URL-encoded
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Session Store
// --------------------
let sessionStore;
try {
  const PgSession = connectPgSimple(session);
  sessionStore = new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: "session",
    createTableIfMissing: true,
  });
} catch (err) {
  console.log("DB unavailable, falling back to memory store for sessions");
  const MemoryStore = require("memorystore")(session);
  sessionStore = new MemoryStore({ checkPeriod: 86400000 });
}

// --------------------
// Express Session
// --------------------
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true, // prevent JS access to cookie
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// --------------------
// API Routes
// --------------------
// Make sure your login route uses req.session correctly
registerRoutes(app);

// --------------------
// Static Frontend
// --------------------
const reactDist = path.join(process.cwd(), "dist");
app.use(express.static(reactDist));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// SPA fallback for React Router / Wouter
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(reactDist, "index.html"));
});

// --------------------
// Test DB Route
// --------------------
app.get("/api/test", async (req, res) => {
  try {
    const result = await db.execute(sql`SELECT 1`);
    res.json({ success: true, result: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// --------------------
// Start Server
// --------------------
createServer(app).listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
