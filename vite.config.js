import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: false,
  plugins: [vue(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_DEV_SERVER_PORT ?? 5173),
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app/web/resources/js'),
    },
  },
  build: {
    outDir: 'public/build',
    manifest: true,
    rollupOptions: {
      input: {
        app: 'app/web/resources/js/app.js',
      },
    },
  },
});
