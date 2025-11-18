import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // para JSX automático
  build: {
    lib: { entry: 'src/index.js', formats: ['es'], fileName: 'index' },
    rollupOptions: {
      // externals para no bundlear React ni el runtime de JSX
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-bootstrap'],
    },
  },
});