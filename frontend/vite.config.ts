import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/mueble-dev/' : '/mueble/';

  return {
    base,
    plugins: [react()],
  };
});
