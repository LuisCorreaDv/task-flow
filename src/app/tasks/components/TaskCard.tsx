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
  updateStatus: (id: Id, status: string) => void;
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
            updateStatus(task.id, e.target.value);
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
          onClick={() => {
            deleteTask(task.id);
          }}
          className="absolute top-1 right-1 cursor-pointer stroke-gray-600 opacity-60 hover:stroke-gray-900 hover:opacity-100 transition duration-200"
        >
          <DeleteIcon />
        </button>
      )}
    </article>
  );
}

export default TaskCard;
