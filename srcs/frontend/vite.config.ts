import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'src',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  build: {
    outDir: '../build',
    emptyOutDir: true
  },
})
