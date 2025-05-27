import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  updateTaskStatus,
  toggleFavorite,
  deleteTask,
} from "@/redux/features/taskSlice";
import toast from "react-hot-toast";

/**
 * Hook for handling Server-Sent Events (SSE) for real-time task updates
 * @param userId - The current user's ID
 */
export const useTaskEvents = (userId: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    // Initialize SSE connection
    const eventSource = new EventSource(`/api/tasks/events?userId=${userId}`);

    // Handle task updates
    eventSource.addEventListener("statusUpdate", (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      dispatch(
        updateTaskStatus({
          userId,
          taskId: data.taskId,
          status: data.status,
        })
      );
      toast.success("Task status updated!");
    });

    // Handle favorite changes
    eventSource.addEventListener("favoriteUpdate", (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      dispatch(
        toggleFavorite({
          userId,
          taskId: data.taskId,
          isFavorite: data.isFavorite,
        })
      );
      toast(
        data.isFavorite
          ? "Task marked as favorite!"
          : "Task removed from favorites",
        {
          icon: "⭐",
        }
      );
    });

    eventSource.addEventListener("deleteTask", (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      dispatch(
        deleteTask({
          userId,
          taskId: data.taskId,
        })
      );
      toast.success("Task deleted successfully!", {
        icon: "🗑️",
      });
    });

    // Handle connection status
    eventSource.onopen = () => {
      toast.success("Real-time updates connected!", {
        duration: 2000,
        icon: "🔄",
      });
    };

    // Handle errors
    eventSource.onerror = () => {
      toast.error("Connection lost. Reconnecting...", {
        duration: 3000,
      });
    };

    // Cleanup on unmount
    return () => eventSource.close();
  }, [userId, dispatch]);
};
