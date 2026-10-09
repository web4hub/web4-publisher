import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const registry = parse(fs.readFileSync(resolve(__dirname, 'www/pages/index.yaml'), 'utf8'));
const configuredBase = new URL(registry.seo.canonical_base_url).pathname;
const base = process.env.VITE_BASE_PATH || configuredBase;
const normalizedBase = base.endsWith('/') ? base : base + '/';

export default defineConfig({
  base: normalizedBase,
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
        main: resolve(__dirname, 'src/browsers.liquid/index.html'),
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
