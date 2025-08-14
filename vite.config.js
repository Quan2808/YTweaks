import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // Copy manifest.json và icons vào thư mục build
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "." },
        // { src: "public/*.png", dest: "." }
      ],
    }),
  ],
  build: {
    outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // UI
        popup: resolve(__dirname, "src/popup/index.html"),
        // Background service worker
        background: resolve(__dirname, "src/background/background.js"),
        // Content script
        content: resolve(__dirname, "src/content/content.js"),
      },
      output: {
        // Đặt folder cho background & content script
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "background/[name].js";
          if (chunk.name === "content") return "content/[name].js";
          return "[name]/[name].js";
        },
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
