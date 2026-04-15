import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const variablesPath = path.resolve(__dirname, 'src/styles/_variables.scss').replace(/\\/g, '/');
const mixinsPath = path.resolve(__dirname, 'src/styles/_mixins.scss').replace(/\\/g, '/');

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${variablesPath}"; @import "${mixinsPath}";\n`,
        silenceDeprecations: ['import'],
      },
    },
  },
});
