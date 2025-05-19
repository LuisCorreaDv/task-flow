// app/tasks/components/TaskBoard.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  addColumn,
  reorderColumns,
  updateColumn,
  deleteColumn,
} from "@/redux/features/columnSlice";
import PlusIcon from "@/Icons/PlusIcon";
import { Column, Id, Task, TaskStatus } from "@/types/TaskTypes";
import { useMemo, useState, useEffect } from "react";
import React from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

export default function TaskBoard() {
  const dispatch: AppDispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.columns.columns);

  // const [columns, setColumns] = useState<Column[]>([]);
  const [mounted, setMounted] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  //useMemo is used to memoize the columnsId array, so it only recalculates when columns change
  // This is useful for performance optimization, as it prevents unnecessary re-renders
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function generateId() {
    return Math.floor(Math.random() * 10000);
  }

  const hanbleAddColumn = (title: string) => {
    dispatch(addColumn(title));
  };

  const handleEditColumn = (id: Id, title: string) => {
    dispatch(updateColumn({ id, title }));
  };

  const handleDeleteColumn = (id: Id) => {
    dispatch(deleteColumn({ id }));
  };

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function onDragStart(event: DragStartEvent) {
    console.log("DragStart", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;
    if (!over || activeId === overId) return;

    const oldIndex = columns.findIndex((col) => col.id === active.id);
    const newIndex = columns.findIndex((col) => col.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(columns, oldIndex, newIndex);
    dispatch(reorderColumns(newOrder));

    setActiveColumn(null); // Limpiamos el estado activo
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    //Drop a Task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    //Drop a task over a column
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      content: `Task ${tasks.length + 1}`,
      columnId,
      status: "default",
    };
    setTasks([...tasks, newTask]);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  }

  function updateTaskStatus(id: Id, status: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, status: status as TaskStatus };
    });
    setTasks(newTasks);
  }

  return (
    <div className="h-full flex flex-col py-1 px-6">
      {/* Tasks Section */}
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <section className="min-w-full">
          <div className="flex gap-4 items-start">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  column={column}
                  key={column.id}
                  updateColumn={handleEditColumn}
                  deleteColumn={handleDeleteColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  updateStatus={updateTaskStatus}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>

            <button
              onClick={() => hanbleAddColumn("New Column")}
              className="bg-sky-500 text-white font-bold py-2 px-4 rounded hover:bg-sky-600 transition duration-200 min-w-[250px] h-[50px] ring-blue-600 hover:ring-2 flex gap-4 items-center"
            >
              <PlusIcon />
              Add Column
            </button>
          </div>
        </section>
        {mounted &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  updateColumn={handleEditColumn}
                  deleteColumn={handleDeleteColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  updateStatus={updateTaskStatus}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                />
              )}{" "}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  updateStatus={updateTaskStatus}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
}
