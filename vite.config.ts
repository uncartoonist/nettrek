import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    target: 'es2022',
  },
  server: {
    port: 4200,
    // Allow iframe embedding from spacechannel dev
    headers: {
      'X-Frame-Options': 'ALLOWALL',
    },
  },
});
