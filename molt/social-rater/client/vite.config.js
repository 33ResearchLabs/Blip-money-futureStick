import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/33/app/',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3033',
      '/dl': 'http://localhost:3033',
    },
  },
  build: {
    outDir: 'dist',
  },
})
