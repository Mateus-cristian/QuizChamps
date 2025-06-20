import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
