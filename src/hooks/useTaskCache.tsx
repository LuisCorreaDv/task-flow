import { useRef, useCallback } from "react";
import { Task, Id } from "@/types/TaskTypes";

interface TaskCache {
  [key: string]: {
    data: Task;
    timestamp: number;
  };
}

/**
 * This hook provides a simple in-memory cache for tasks.
 * @param timeToLive Time in milliseconds for how long a cache entry remains valid (default: 60000ms = 1 minute)
 */
export function useTaskCache(timeToLive = 60000) {
  const cacheRef = useRef<TaskCache>({});

  // Function to get a task from the cache
  // If the task is not found or has expired, it returns null
  //useCallback is used to memoize the function so that it does not change on every render
  const getFromCache = useCallback(
    (taskId: Id): Task | null => {
      const cached = cacheRef.current[taskId];
      if (!cached) return null;

      const now = Date.now();
      if (now - cached.timestamp > timeToLive) {
        // Cache entry has expired
        delete cacheRef.current[taskId];
        return null;
      }

      // Return the cached task if it is still valid
      return cached.data;
    },
    [timeToLive]
  );

    // Function to set a task in the cache
  const setInCache = useCallback((task: Task) => {
    // Cache ref is a mutable object, so we can directly modify it
    cacheRef.current[task.id] = {
      data: task,
      timestamp: Date.now(),
    };
  }, []);

  // Invalidate a specific task from the cache
  // This function removes the task from the cache, allowing it to be fetched again
  const invalidateCache = useCallback((taskId: Id) => {
    delete cacheRef.current[taskId];
  }, []);

  return {
    getFromCache,
    setInCache,
    invalidateCache,
  };
}
