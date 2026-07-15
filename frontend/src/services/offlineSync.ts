import API from "./api";

// Sistema de sincronización offline
interface OfflineAction {
  id: string;
  type: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'haitibiz_offline_queue';

export const offlineSync = {
  // Agregar acción a la cola offline
  addAction: (type: 'POST' | 'PUT' | 'PATCH' | 'DELETE', endpoint: string, data: any) => {
    try {
      const queue = offlineSync.getQueue();
      const action: OfflineAction = {
        id: `${Date.now()}_${Math.random()}`,
        type,
        endpoint,
        data,
        timestamp: Date.now(),
      };
      queue.push(action);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      return action.id;
    } catch (error) {
      console.error('Error al agregar acción offline:', error);
    }
  },

  // Obtener la cola offline
  getQueue: (): OfflineAction[] => {
    try {
      const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error al obtener cola offline:', error);
      return [];
    }
  },

  // Procesar la cola cuando se recupera la conexión
  processQueue: async () => {
    const queue = offlineSync.getQueue();
    const failed: OfflineAction[] = [];

    for (const action of queue) {
      try {
        switch (action.type) {
          case 'POST':
            await API.post(action.endpoint, action.data);
            break;
          case 'PUT':
            await API.put(action.endpoint, action.data);
            break;
          case 'PATCH':
            await API.patch(action.endpoint, action.data);
            break;
          case 'DELETE':
            await API.delete(action.endpoint);
            break;
        }
      } catch (error) {
        failed.push(action);
        console.error(`Error al sincronizar acción ${action.id}:`, error);
      }
    }

    // Guardar solo las acciones que fallaron
    if (failed.length > 0) {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failed));
    } else {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    }

    return {
      success: queue.length - failed.length,
      failed: failed.length,
    };
  },

  // Limpiar la cola
  clearQueue: () => {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  },

  // Guardar datos en localStorage con expiración
  setLocalData: (key: string, value: any, expirationMinutes: number = 1440) => {
    const item = {
      value,
      expiration: Date.now() + expirationMinutes * 60 * 1000,
    };
    localStorage.setItem(`haitibiz_data_${key}`, JSON.stringify(item));
  },

  // Obtener datos del localStorage verificando expiración
  getLocalData: (key: string) => {
    try {
      const item = localStorage.getItem(`haitibiz_data_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiration) {
        localStorage.removeItem(`haitibiz_data_${key}`);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('Error al obtener datos locales:', error);
      return null;
    }
  },

  // Sincronizar datos de lectura (GET) al caché
  cacheApiData: (endpoint: string, data: any, expirationMinutes: number = 60) => {
    offlineSync.setLocalData(`api_${endpoint}`, data, expirationMinutes);
  },

  // Obtener datos cacheados
  getCachedData: (endpoint: string) => {
    return offlineSync.getLocalData(`api_${endpoint}`);
  },
};
