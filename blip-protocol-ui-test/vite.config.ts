import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', '@radix-ui/react-tooltip', '@radix-ui/react-dialog'],
          'vendor-solana': ['@solana/web3.js', '@solana/wallet-adapter-base', '@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
}));
