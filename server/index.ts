import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { db } from "./db.js";
import { registerRoutes } from "./routes.js";
import "dotenv/config";
import { Pool } from "pg";

// Create a shared pg Pool for sessions & DB checks
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

// Lazily load connect-pg-simple in an ESM-compatible way
async function createSessionStore() {
  const dbUrl = process.env.DATABASE_URL;
  try {
    if (!dbUrl) throw new Error("No DATABASE_URL provided");

    // Probe DB connectivity before wiring session store
    await dbPool.query("SELECT 1");

    const connectPgSimpleModule = await import("connect-pg-simple");
    const connectPgSimple = (connectPgSimpleModule as any).default ?? connectPgSimpleModule;
    const PgSession = connectPgSimple(session);

    // Use Pool + explicit table name, mirroring the provided snippet
    return new PgSession({
      pool: dbPool,
      tableName: "session",
      schemaName: "public",
      // Avoid reading table.sql from bundled dist; rely on migrations/SQL run in Supabase
      createTableIfMissing: false,
    });
  } catch (err) {
    console.error("DB unavailable for session store, falling back to memory store:", (err as Error)?.message);
    const memorystoreModule = await import("memorystore");
    const MemoryStore = (memorystoreModule as any).default(session);
    return new MemoryStore({ checkPeriod: 86400000 });
  }
}

const app = express();
// Trust Render/Proxy so secure cookies work correctly
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

// --------------------
// CORS
// --------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
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
(async () => {
  const sessionStore = await createSessionStore();

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "super-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  // --------------------
  // API Routes
  // --------------------
  const httpServer = createServer(app);
  registerRoutes(app);

  // --------------------
  // Static Frontend
  // --------------------
  const reactDist = path.join(process.cwd(), "dist");
  app.use(express.static(reactDist));
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(reactDist, "index.html"));
  });

  // --------------------
  // Test DB Route
  // --------------------
  app.get("/api/test", async (req, res) => {
    try {
      const result = await db.execute("SELECT 1");
      res.json({ success: true, result: result.rows });
    } catch (err) {
      res.status(500).json({ error: "Database query failed" });
    }
  });

  // --------------------
  // Start Server
  // --------------------
  httpServer.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})();
