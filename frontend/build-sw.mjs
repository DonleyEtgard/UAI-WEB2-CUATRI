import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Script para compilar el service worker TypeScript a JavaScript
async function buildServiceWorker() {
  const swSource = path.join(__dirname, 'public/service-worker.ts');
  const swDest = path.join(__dirname, 'public/service-worker.js');

  try {
    // Leer el archivo TypeScript
    let content = fs.readFileSync(swSource, 'utf-8');

    // Remover las anotaciones de tipo y comentarios de TypeScript
    content = content.replace(/: (string|number|boolean|any|Request|Response|ExtendableEvent|FetchEvent)[^;{=]*/g, '');
    content = content.replace(/<[^>]+>/g, ''); // Remover tipos genéricos
    content = content.replace(/declare const self: ServiceWorkerGlobalScope;/g, '');

    // Escribir el archivo JavaScript compilado
    fs.writeFileSync(swDest, content, 'utf-8');
    console.log('✅ Service Worker compilado correctamente');
  } catch (error) {
    console.error('❌ Error al compilar Service Worker:', error);
    process.exit(1);
  }
}

buildServiceWorker();
