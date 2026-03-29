import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "node:url"; // ← زيد هاد السطر
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), 
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/sanctum": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
          cookieDomainRewrite: "localhost",
      },
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
          cookieDomainRewrite: "localhost",
      },
    },
  },
});