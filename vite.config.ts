import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // `npm run dev:api` serves the API locally on 8787.
  server: { proxy: { '/api': 'http://localhost:8787' } },
  test: {
    environment: 'node',
  },
});
