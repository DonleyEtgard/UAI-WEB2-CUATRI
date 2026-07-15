import { offlineSync } from '../services/offlineSync';

export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const isLocalhost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
  if (import.meta.env.DEV || isLocalhost) {
    console.log('Service worker deshabilitado en desarrollo/local');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registrado:', registration.scope);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📦 Nueva versión disponible, refresca para aplicar los cambios');
            }
          });
        }
      });
    } catch (error) {
      console.warn('❌ Error al registrar Service Worker:', error);
    }
  });

  window.addEventListener('online', () => {
    offlineSync.processQueue().then((result) => {
      if (result.success > 0) {
        console.log(`🔄 Sincronizados ${result.success} cambios offline`);
      }
      if (result.failed > 0) {
        console.warn(`⚠️ ${result.failed} cambios no pudieron sincronizarse aún`);
      }
    });
  });
};
