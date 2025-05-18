import DeleteIcon from "@/Icons/DeleteIcon";
import { Id, Task } from "@/types/TaskTypes";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}


function TaskCard({ task, deleteTask, updateTask }: TaskCardProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={stlye}
        className="bg-white h-[75px] min-h-[75px] rounded-lg border-2 border-dashed opacity-50"
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
        className="bg-white h-[100px] min-h-[100px] items-center flex text-left flex-col rounded-lg px-3 py-5 shadow-sm hover:bg-gray-50  border-transparent hover:border-gray-200 transition-colors duration-200 cursor-grab relative"
      >
        <header className="h-4 w-[75%] rounded-b-full bg-gray-200 absolute top-0"></header>
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-gray-600 focus:outline-none text-sm"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
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
      <header className="h-4 w-[75%] rounded-b-full bg-gray-200 absolute top-0"></header>
      <p className=" my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words text-sm">
        {task.content}
      </p>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="absolute top-2 right-2 cursor-pointer stroke-gray-600 opacity-60 hover:stroke-gray-900 hover:opacity-100 transition duration-200"
        >
          <DeleteIcon />
        </button>
      )}
    </article>
  );
}

export default TaskCard;
