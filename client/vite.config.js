import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // ✅ makes Vite listen on all interfaces (not just localhost)
    port: 5173         // optional: used only locally
  },
  preview: {
    host: '0.0.0.0',   // ✅ also needed for vite preview in Render
    port: process.env.PORT || 4173 // ✅ use Render’s assigned port
  }
})
