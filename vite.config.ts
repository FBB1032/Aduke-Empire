import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const replitPlugins =
  process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
    ? [
        import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
        import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
      ]
    : [];

export default defineConfig({
  plugins: [react(), runtimeErrorOverlay(), ...replitPlugins] as PluginOption[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
