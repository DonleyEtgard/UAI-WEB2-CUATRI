import API from './api';
import { offlineSync } from './offlineSync';

type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const isOfflineError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return true;
  }

  const anyError = error as { response?: unknown; message?: string };
  return !anyError.response || !!(anyError.message && anyError.message.includes('Network'));
};

export const getWithCache = async <T>(endpoint: string): Promise<T> => {
  try {
    console.log("GET API:", endpoint);

    const response = await API.get<T>(endpoint);

    console.log("API RESPONSE:", response.data);

    offlineSync.cacheApiData(endpoint, response.data, 60);

    return response.data;
  } catch (error) {
    console.error("API ERROR:", error);

    const cached = offlineSync.getCachedData(endpoint);
    if (cached) {
      return cached as T;
    }

    throw error;
  }
};

export const requestOrQueue = async <T>(
  method: Method,
  endpoint: string,
  data?: unknown,
  fallback?: T
): Promise<T> => {
  const enqueue = (): T => {
    offlineSync.addAction(method, endpoint, data);
    if (fallback !== undefined) {
      return fallback;
    }
    return ({} as T);
  };

  if (!navigator.onLine) {
    return enqueue();
  }

  try {
    const response = await API.request<T>({
      method: method.toLowerCase() as any,
      url: endpoint,
      data,
    });

    await offlineSync.processQueue();
    return response.data;
  } catch (error) {
    if (isOfflineError(error)) {
      return enqueue();
    }
    throw error;
  }
};