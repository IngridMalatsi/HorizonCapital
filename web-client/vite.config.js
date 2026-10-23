import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all local IPs (0.0.0.0) so co-developers can test on mobile devices on the same Wi-Fi
    port: 5173,
    open: true, // Automatically opens the browser on start
    proxy: {
      '/api': {
        target: process.env.API_SERVER_URL || 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
})
