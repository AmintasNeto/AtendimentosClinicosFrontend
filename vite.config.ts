import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //change port for production
  preview: {
    port: 7293,
  },
  // for dev
  server: {
    port: 5180,
  },
})
