/// <reference lib="webworker" />

export {};

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'haitibiz-erp-v1';
const RUNTIME_CACHE = 'haitibiz-runtime-v1';
const API_CACHE = 'haitibiz-api-v1';

// Archivos que siempre se cachean durante la instalación
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/index.css',
];

// Instalación del service worker
sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Error al cachear archivos estáticos:', err);
      });
    })
  );
  sw.skipWaiting();
});

// Activación del service worker
sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  sw.clients.claim();
});

// Estrategia de caché: Network First para APIs, Cache First para assets
sw.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);

  // No cachear chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Solicitudes a APIs
  if (url.pathname.startsWith('/api')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // Solicitudes a recursos estáticos
  if (
    event.request.method === 'GET' &&
    (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/i) || url.pathname === '/')
  ) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }

  // Por defecto: Network First
  event.respondWith(networkFirstStrategy(event.request));
});

// Estrategia Network First: intenta la red primero, cachea como fallback
async function networkFirstStrategy(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    // Cachear respuestas exitosas de GET
    if (request.method === 'GET' && networkResponse.status === 200) {
      const cache = await caches.open(request.url.includes('/api') ? API_CACHE : RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Si la red falla, intenta obtener del caché
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Si es una solicitud de navegación sin caché, devuelve la página principal
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match('/index.html')) || new Response('Offline - Página no disponible', { status: 503 });
    }

    // Respuesta genérica de error offline
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'No hay conexión a internet',
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Estrategia Cache First: intenta el caché primero, luego la red
async function cacheFirstStrategy(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Recurso no disponible offline', { status: 503 });
  }
}

// Manejar mensajes desde el cliente
sw.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    sw.skipWaiting();
  }
});
