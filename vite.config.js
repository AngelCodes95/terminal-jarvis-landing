import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/terminal-jarvis-landing/' : '/',
  define: {
    global: 'globalThis'
  },
  server: {
    host: true,
    port: 5173,
    cors: true
  },
  preview: {
    host: true,
    port: 4173,
    cors: true
  }
}))
