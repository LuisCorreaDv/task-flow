import { useState, useCallback } from "react";
import { Task, Id } from "@/types/TaskTypes";

interface LockState {
  isLocked: boolean;
  version: number;
  lockedAt: number;
}

/**
 * Hook for managing optimistic locking in concurrent task editing
 * Provides mechanisms to prevent conflict in concurrent edits
 */
export function useOptimisticLock(lockTimeout = 30000) {
  const [lockState, setLockState] = useState<Record<Id, LockState>>({});

  /**
   * Verifies if a task can be updated based on its version
   * @param task Task to verify
   */
  const canUpdate = useCallback(
    (task: Task): boolean => {
      const currentLock = lockState[task.id];
      if (!currentLock) return true;

      const now = Date.now();
      // Release lock if it has expired
      if (now - currentLock.lockedAt > lockTimeout) {
        releaseLock(task.id);
        return true;
      }

      return currentLock.version === task.version;
    },
    [lockState, lockTimeout]
  );

  /**
   * Attempts to acquire a lock for task editing
   * @param taskId Task identifier
   * @param version Current version of the task
   */
  const acquireLock = useCallback(
    (taskId: Id, version: number): boolean => {
      const currentLock = lockState[taskId];
      const now = Date.now();

      // If there's a lock but it has expired, we can acquire it
      if (currentLock && now - currentLock.lockedAt <= lockTimeout) {
        return false;
      }

      setLockState((prev) => ({
        ...prev,
        [taskId]: { isLocked: true, version, lockedAt: now },
      }));
      return true;
    },
    [lockState, lockTimeout]
  );

  /**
   * Releases the lock on a task
   * @param taskId Task identifier
   */
  const releaseLock = useCallback((taskId: Id) => {
    setLockState((prev) => {
      const newState = { ...prev };
      delete newState[taskId];
      return newState;
    });
  }, []);

  return {
    canUpdate,
    acquireLock,
    releaseLock,
    lockState,
  };
}
