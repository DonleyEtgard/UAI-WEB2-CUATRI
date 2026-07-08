import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin para compilar y copiar el service worker
function serviceWorkerPlugin(): Plugin {
  return {
    name: 'service-worker-plugin',
    generateBundle() {
      try {
        // Leer el service worker TypeScript
        let swContent = fs.readFileSync(
          path.resolve(__dirname, 'public/service-worker.js'),
          'utf-8'
        )

        // Remover tipos de TypeScript
        swContent = swContent
          .replace(/: (string|number|boolean|any|Request|Response|ExtendableEvent|FetchEvent|ServiceWorkerGlobalScope)/g, '')
          .replace(/ as unknown as ServiceWorkerGlobalScope/g, '')
          .replace(/ as (any|unknown)/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/export {};/g, '')
        // Emitir como archivo JavaScript
        this.emitFile({
          type: 'asset',
          fileName: 'service-worker.js',
          source: swContent,
        })

        console.log('✅ Service Worker compilado')
      } catch (error) {
        console.error('❌ Error al compilar Service Worker:', error)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), serviceWorkerPlugin()],
 resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),

    // Forzar una única instancia de React
    react: path.resolve(__dirname, './node_modules/react'),
    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
  },
},
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'lucide-react',
    'react-apexcharts',
    'apexcharts',
  ],
},
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
})
