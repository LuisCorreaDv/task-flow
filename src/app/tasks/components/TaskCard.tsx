import DeleteIcon from "@/Icons/DeleteIcon";
import StarIcon from "@/Icons/StarIcon";
import { Id, Task, TaskStatus } from "@/types/TaskTypes";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

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

  const statusColors: Record<TaskStatus, string> = {
    on_time: "bg-green-100",
    delayed: "bg-yellow-400",
    on_going: "bg-sky-400",
    urgent: "bg-red-400",
    default: "bg-gray-200",
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

  const toggleEditMode = () => {
    if (!isSelectingStatus) {
      setEditMode((prev) => !prev);
      setMouseIsOver(false);
    }
  };

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
        ></header>
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-gray-600 focus:outline-none text-sm"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (
              !relatedTarget ||
              (!relatedTarget?.closest("select") && !isSelectingStatus)
            ) {
              toggleEditMode();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
            if (e.key === "Escape") toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
        <select
          value={task.status}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateStatus(task.id, e.target.value as TaskStatus);
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
            toggleFavorite(task.id);
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
                <h3 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Task
                </h3>
                <button
                  type="button"
                  aria-label="Close modal"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setSelectedTaskId(null)}
                >
                </button>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this task? This action cannot be
                  undone.
                </p>
              </div>
              <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteTask(selectedTaskId);
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
