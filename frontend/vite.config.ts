import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensures Vite always runs on port 5173 to keep CORS matching consistent
    port: 5173,
    strictPort: true,
    host: true, // Exposes the server to the local network if needed
  },
  build: {
    // Generates high-quality source maps for cleaner production debugging
    sourcemap: true,
    // Out-of-the-box optimization breakdown for assets
    outDir: 'dist',
  }
});