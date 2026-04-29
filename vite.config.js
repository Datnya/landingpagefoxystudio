import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nosotros: resolve(__dirname, 'nosotros.html'),
        servicios: resolve(__dirname, 'servicios.html'),
        herramientas: resolve(__dirname, 'herramientas.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        'servicio-detalle': resolve(__dirname, 'servicio-detalle.html'),
      },
    },
  },
})
