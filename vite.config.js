import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@styles': resolve(__dirname, 'src/styles'),
      '@posts': resolve(__dirname, 'posts'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'theme-default': resolve(
          __dirname,
          'src/styles/reset.scss'
        ),
        'theme-win95': resolve(
          __dirname,
          'src/styles/win95.scss'
        ),
        'flavour-glitch': resolve(
          __dirname,
          'src/styles/flavours/glitch/reset.scss'
        ),
      },
    },
  },
});
