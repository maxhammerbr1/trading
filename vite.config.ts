// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["nome-do-pacote-faltando"]
    }
  }
});
