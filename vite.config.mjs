import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    host: 'localhost'
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['__STATIC_CONTENT_MANIFEST', 'node:async_hooks']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
