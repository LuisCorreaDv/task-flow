import { useRef, useCallback } from 'react';
import { Task, Id } from '@/types/TaskTypes';

interface TaskCache {
  [key: string]: {
    data: Task;
    timestamp: number;
  };
}

/**
 * Hook personalizado para gestionar el caché de tareas en memoria
 * @param timeToLive Tiempo en milisegundos que una entrada permanece válida en caché (default: 60000ms = 1 minuto)
 */
export function useTaskCache(timeToLive = 60000) {
  const cacheRef = useRef<TaskCache>({});

  const getFromCache = useCallback((taskId: Id): Task | null => {
    const cached = cacheRef.current[taskId];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > timeToLive) {
      // La entrada de caché ha expirado
      delete cacheRef.current[taskId];
      return null;
    }

    return cached.data;
  }, [timeToLive]);

  const setInCache = useCallback((task: Task) => {
    cacheRef.current[task.id] = {
      data: task,
      timestamp: Date.now()
    };
  }, []);

  const invalidateCache = useCallback((taskId: Id) => {
    delete cacheRef.current[taskId];
  }, []);

  return {
    getFromCache,
    setInCache,
    invalidateCache
  };
}
