import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app/web/resources/js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['app/web/resources/js/**/*.test.js'],
    setupFiles: ['app/web/resources/js/test/setup.js'],
  },
});
