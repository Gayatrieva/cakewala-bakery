// ─── vite.config.js ───────────────────────────────────────────────────────────
// Vite build configuration for React (JSX) support via @vitejs/plugin-react.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,   // auto-opens browser on `npm run dev`
  },
});
