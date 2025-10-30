import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Bind to all interfaces so localhost (127.0.0.1) and IPv6 (::1) both work.
    // Using 0.0.0.0 ensures the dev server listens on IPv4 localhost as well.
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
  },
  optimizeDeps: {
    // Help Vite determine entry points for pre-bundling during dev re-optimization
    entries: [
      path.resolve(__dirname, 'index.html'),
      path.resolve(__dirname, 'src/main.tsx'),
      path.resolve(__dirname, 'src/App.tsx'),
    ],
    // Explicit includes silence auto-detect warnings and speed up cold starts
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-router-dom',
      '@tanstack/react-query',
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
}));
