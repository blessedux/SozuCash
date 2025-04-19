import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { crx } from 'vite-plugin-chrome-extension';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: './src/manifest.json' })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // Manifest file
        manifest: resolve(__dirname, 'src/manifest.json'),
        // Background script
        background: resolve(__dirname, 'src/background/index.ts'),
        // Content script for Twitter injection
        content: resolve(__dirname, 'src/content/twitter-inject.ts'),
        // Popup UI
        popup: resolve(__dirname, 'src/popup/index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    sourcemap: true,
    minify: false, // For development, can change to true for production
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}); 