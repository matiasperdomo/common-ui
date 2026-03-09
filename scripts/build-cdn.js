/**
 * Build script para generar los bundles CDN (IIFE autocontenidos).
 * Genera dos archivos en dist/cdn/:
 *   - common-ui.js  → componentes + utilidades como window.CommonUI (recomendado)
 *   - utils.js      → solo utilidades como window.CommonUI (sin Web Components)
 *
 * Uso: node scripts/build-cdn.js
 */
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { copyFileSync, mkdirSync } from 'fs';

const components = [
  {
    entry: 'src/web-components/index.wc.jsx',
    fileName: 'common-ui',
    name: 'CommonUI',
  },
  {
    entry: 'src/web-components/utils.entry.js',
    fileName: 'utils',
    name: 'CommonUI',
  },
];

for (const [i, { entry, fileName, name }] of components.entries()) {
  console.log(`\n→ Building ${fileName}.js...`);

  await build({
    configFile: false,
    plugins: [react(), cssInjectedByJsPlugin()],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    build: {
      outDir: 'dist/cdn',
      emptyOutDir: i === 0,
      lib: {
        entry,
        name,
        formats: ['iife'],
        fileName: () => `${fileName}.js`,
      },
      rollupOptions: {
        external: [],
        output: {
          globals: {},
        },
      },
    },
  });

  console.log(`✓ dist/cdn/${fileName}.js`);
}

console.log('\n CDN build completo → dist/cdn/');

// Copiar assets estáticos
mkdirSync('dist/cdn', { recursive: true });
copyFileSync('src/img/icon-pba.ico', 'dist/cdn/icon-pba.ico');
console.log('✓ dist/cdn/icon-pba.ico');
