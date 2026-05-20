import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/api': 'http://127.0.0.1:5555'
    // }
    host: "0.0.0.0",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.js",
    css: false,
    env: {
      VITE_API_BASE_URL: "http://localhost:3000",
      VITE_IP_ADD: "localhost",
    },
  },
});
