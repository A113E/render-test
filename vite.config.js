import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que el servidor sea accesible desde fuera del localhost
    port: process.env.PORT || 5173 // Usa el puerto proporcionado por Render o un puerto por defecto
  }
})

