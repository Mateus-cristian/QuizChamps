import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: 'app/',
  plugins: [
    tailwindcss(), reactRouter(), tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@domain': path.resolve(__dirname, './app/domain'),
      '@routes': path.resolve(__dirname, './app/routes'),
      '@hooks': path.resolve(__dirname, './app/hooks'),
      '@ui': path.resolve(__dirname, './app/ui'),
    },
  },
  server: {
    port: 5173,
  },
})
