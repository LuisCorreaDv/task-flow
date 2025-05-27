import DeleteIcon from "@/Icons/DeleteIcon";
import StarIcon from "@/Icons/StarIcon";
import { Id, Task, TaskStatus } from "@/types/TaskTypes";
import { useSortable } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { CSS } from "@dnd-kit/utilities";
import { validateTaskContent } from "@/utils/validations";
import { useAppSelector } from "@/redux/hooks";
import { useTaskCache } from "@/hooks/useTaskCache";
import { useOptimisticLock } from "@/hooks/useLock";
// import { compress, decompress } from "@/utils/compression";
// import { useEffect } from "react";

interface TaskCardProps {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  updateStatus: (id: Id, status: TaskStatus) => void;
  toggleFavorite: (id: Id) => void;
}

function TaskCard({
  task,
  deleteTask,
  updateTask,
  updateStatus,
  toggleFavorite,
}: TaskCardProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSelectingStatus, setIsSelectingStatus] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<Id | null>(null);
  const [tempContent, setTempContent] = useState(task.content);

  // -----   Show compress task data -------
  // const showTaskData = () => {
  //   console.group(`Task Data - ID: ${task.id}`);
  //   console.log('Original task content:', task);

  //   const compressedTask = compress(task);
  //   console.log('Compressed task content:', compressedTask);

  //   const decompressedTask = decompress(compressedTask);
  //   console.log('Decompressed task content:', decompressedTask);
  // };

  // // Ejecutar la función cuando el componente se monte
  // useEffect(() => {
  //   showTaskData();
  // }, [task]);
  // Initialize cache hooks for task data persistence
  const { getFromCache, setInCache, invalidateCache } = useTaskCache();

  // Setup cache management
  useEffect(() => {
    if (task.id) {
      const cachedTask = getFromCache(task.id);
      // Only update cache if task version is newer or not cached
      if (!cachedTask || cachedTask.version < task.version) {
        setInCache(task);
      }
    }
  }, [task, getFromCache, setInCache]);

  // Initialize optimistic lock hook
  const { canUpdate, acquireLock, releaseLock } = useOptimisticLock();

  // Handle edit mode with concurrency control
  const toggleEditMode = () => {
    if (!isSelectingStatus) {
      if (!editMode) {
        // Try to acquire lock when entering edit mode
        if (!acquireLock(task.id, task.version)) {
          window.alert(
            "This task is currently being edited by another user. Please try again later."
          );
          return;
        }
      } else {
        // Release lock when exiting edit mode
        releaseLock(task.id);
      }

      setEditMode((prev) => !prev);
      setMouseIsOver(false);
      setTempContent(task.content);
    }
  };

  // Get the user ID from the Redux store and the tasks for that user
  //Fallback to an empty object if tasks are not available
  // This is useful for ensuring that the component does not crash if the tasks are not loaded yet
  const userId = useAppSelector((state) => state.auth.token ?? "");
  const allTasks = useAppSelector((state) => state.tasks[userId]?.tasks || {});

  // Task handlers with cache management
  const handleUpdateTask = (id: Id, content: string) => {
    invalidateCache(id);
    updateTask(id, content);
  };

  const handleUpdateStatus = (id: Id, status: TaskStatus) => {
    invalidateCache(id);
    updateStatus(id, status);
    // Emit SSE event
    fetch(`/api/tasks/events?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "statusUpdate", taskId: id, status }),
    });
  };

  const handleToggleFavorite = (id: Id) => {
    invalidateCache(id);
    toggleFavorite(id);
    // Emit SSE event
    fetch(`/api/tasks/events?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "favoriteUpdate",
        taskId: id,
        isFavorite: !task.isFavorite, // Toggle favorite status
      }),
    });
  };

  const handleDeleteTask = (id: Id) => {
    invalidateCache(id);
    deleteTask(id);

    // Emit SSE event after local deletion
    fetch(`/api/tasks/events?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "deleteTask",
        taskId: id,
      }),
    });
  };

  const statusColors: Record<TaskStatus, string> = {
    on_time: "bg-green-100",
    delayed: "bg-yellow-400",
    on_going: "bg-sky-400",
    urgent: "bg-red-400",
    default: "bg-gray-200",
    completed: "bg-green-800",
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const stlye = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Update task with version check
  const handleContentValidation = (force = false) => {
    const isValid = validateTaskContent(tempContent);

    // Check for duplicate content
    const isDuplicate = Object.values(allTasks).some(
      (selectedTask: Task) =>
        selectedTask.id !== task.id &&
        selectedTask.content.trim().toLowerCase() ===
          tempContent.trim().toLowerCase()
    );

    if (isDuplicate) {
      if (force) {
        window.alert("A task with the same content already exists");
      }
      return;
    }

    if (isValid) {
      if (!canUpdate(task)) {
        window.alert(
          "This task has been modified by another user. Please refresh and try again."
        );
        releaseLock(task.id);
        setEditMode(false);
        return;
      }

      handleUpdateTask(task.id, tempContent.trim());
      setEditMode(false);
    } else if (force) {
      window.alert(
        "Task content must be between 3 and 50 characters long and contain no special characters."
      );
    }
  };
  // Cleanup locks on unmount
  useEffect(() => {
    return () => {
      if (editMode) {
        releaseLock(task.id);
      }
    };
  }, [editMode, task.id, releaseLock]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={stlye}
        className="bg-white h-[100px] min-h-[100px] rounded-lg border-2 border-dashed opacity-50"
      ></div>
    );
  }

  if (editMode) {
    return (
      <article
        ref={setNodeRef}
        style={stlye}
        {...attributes}
        {...listeners}
        className="bg-white h-[100px] min-h-[100px] items-center flex text-left flex-col rounded-lg px-3 py-5 shadow-sm  border-transparent hover:border-gray-200 transition-colors duration-200 cursor-grab relative"
      >
        {" "}
        <header
          className={`h-4 w-[75%] rounded-b-full absolute top-0 ${
            statusColors[task.status as TaskStatus] ?? statusColors.default
          }`}
        ></header>{" "}
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-gray-600 focus:outline-none text-sm"
          value={tempContent}
          autoFocus
          placeholder="Task content here"
          onFocus={(e) => {
            e.target.select();
          }}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (
              !relatedTarget ||
              (!relatedTarget?.closest("select") && !isSelectingStatus)
            ) {
              handleContentValidation(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
              handleContentValidation(true);
            }
            if (e.key === "Escape") toggleEditMode();
          }}
          onChange={(e) => {
            setTempContent(e.target.value);
          }}
        ></textarea>
        <select
          value={task.status}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleUpdateStatus(task.id, e.target.value as TaskStatus);
            setIsSelectingStatus(false);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsSelectingStatus(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsSelectingStatus(false);
              setEditMode(false);
            }, 50);
          }}
          onClick={(e) => e.stopPropagation()}
          className="text-sm mt-2 w-fit px-2 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="default">Select Status</option>
          <option value="on_time">On Time</option>
          <option value="on_going">On Going</option>
          <option value="delayed">Delayed</option>
          <option value="urgent">Urgent</option>
          <option value="completed">Completed</option>
        </select>
      </article>
    );
  }

  return (
    <>
      <article
        ref={setNodeRef}
        style={stlye}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        onMouseOver={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
        className="bg-white h-[100px] min-h-[100px] items-center flex text-left flex-col rounded-lg px-3 py-5 shadow-sm hover:bg-gray-50  border-transparent hover:border-gray-200 transform transition-transform duration-300 hover:translate-y-[-5px]  cursor-grab relative"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(task.id);
          }}
          className="absolute bottom-2 left-2 cursor-pointer text-yellow-500 hover:text-yellow-600 transition"
          aria-label="Toggle favorite"
        >
          <StarIcon filled={task.isFavorite} />
        </button>{" "}
        <header
          className={`h-4 w-[75%] rounded-b-full absolute top-0 ${
            statusColors[task.status as TaskStatus] ?? statusColors.default
          }`}
        ></header>
        <p className=" my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words text-sm">
          {task.content}
        </p>
        {mouseIsOver && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedTaskId(task.id);
            }}
            className="absolute top-1 right-1 cursor-pointer stroke-gray-600 opacity-60 hover:stroke-gray-900 hover:opacity-100 transition duration-200"
          >
            <DeleteIcon />
          </button>
        )}
      </article>
      {/* Delete Task Modal */}
      {selectedTaskId === task.id && (
        <div
          id="delete-task-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center flex w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-900/50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  Delete Task
                </h3>
                <button
                  type="button"
                  aria-label="Close modal"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setSelectedTaskId(null)}
                ></button>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </p>
              </div>
              <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteTask(selectedTaskId);
                    setSelectedTaskId(null);
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="ms-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() => setSelectedTaskId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
