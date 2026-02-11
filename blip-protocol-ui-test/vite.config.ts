import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8082,
    strictPort: true,
    cors: true,
    allowedHosts: [
      "localhost",
      ".ngrok-free.app",
      ".ngrok.io",
    ],
    hmr: {
      clientPort: 8082,
      host: "9f91-157-49-186-209.ngrok-free.app",
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
