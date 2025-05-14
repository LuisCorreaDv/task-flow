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

  if(isDragging) {
    return (
        <div ref={setNodeRef} style={stlye} className="bg-white h-[75px] min-h-[75px] rounded-lg border-2 border-dashed opacity-50" >

        </div>
    )
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={stlye}
        {...attributes}
        {...listeners}
        className="bg-white rounded-lg p-3 shadow-sm hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 transition-colors duration-200 flex text-left cursor-grab"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-gray-600 focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={stlye}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseOver={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-white h-[75px] min-h-[75px] items-center flex text-left rounded-lg p-3 shadow-sm hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 transition-colors duration-200 cursor-grab relative"
    >
      <p className=" my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words">
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
    </div>
  );
}

export default TaskCard;
