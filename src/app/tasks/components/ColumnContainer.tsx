import AddIcon from "@/Icons/AddIcon";
import DeleteIcon from "@/Icons/DeleteIcon";
import { Column, Id, Task } from "@/types/TaskTypes";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function ColumnContainer(props: ColumnContainerProps) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id)
  }, [tasks])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const stlye = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={stlye}
        className="bg-[#f1f2f4] rounded-4xl shadow-lg min-w-[275px] h-[550px] flex flex-col gap-2 opacity-45 border-dashed border-2"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={stlye}
      className="bg-[#f1f2f4] rounded-4xl shadow-lg min-w-[275px] h-[550px] flex flex-col gap-2"
    >
      {/* Column title */}
      <header
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-[#ebebeb] p-4 text-md h-[60px] rounded-md rounded-b-none font-semibold text-gray-700 flex items-center justify-between cursor-grab"
      >
        {!editMode && column.title}
        {editMode && (
          <input
            className="bg-[#f1f2f4] w-[80%] border-none rounded-md py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] transition-shadow duration-200"
            value={column.title}
            onChange={(e) => updateColumn(column.id, e.target.value)}
            autoFocus
            onBlur={() => {
              setEditMode(false);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
          />
        )}

        {/* Delete button */}
        <button
          className="cursor-pointer stroke-gray-600 hover:stroke-gray-900 transition duration-200"
          onClick={(e) => {
            e.stopPropagation();
            deleteColumn(column.id);
          }}
        >
          <DeleteIcon />
        </button>
      </header>

      {/* Column content */}
      <section className="flex flex-grow flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </section>

      {/* Column Footer */}
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 items-center px-4 py-2 mb-4 mx-4 cursor-pointer hover:bg-[#dfe1e6] hover:text-gray-700 text-gray-500 rounded-4xl transition-colors duration-200"
      >
        <AddIcon />
        <span className="text-sm font-medium">Add a task</span>
      </button>
    </div>
  );
}

export default ColumnContainer;
