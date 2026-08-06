import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Served from https://athar-training.github.io/Prime2026/inner-circle/
  base: "/Prime2026/inner-circle/",
  plugins: [react(), tailwindcss()],
});
