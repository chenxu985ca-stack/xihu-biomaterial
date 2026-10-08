import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE || '/biomaterial/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Supabase client (~180KB) — only needed on /admin or if DB is used
          supabase: ['@supabase/supabase-js'],
          // Icons — stable, rarely changes, great for caching
          icons: ['lucide-react'],
        },
      },
    },
  },
});
