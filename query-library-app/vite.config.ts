import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Set the base path for GitHub Pages
  base: '/Query-Library/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
