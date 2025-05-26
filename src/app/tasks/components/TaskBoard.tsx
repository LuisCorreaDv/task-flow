// app/tasks/components/TaskBoard.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
// Columns
import {
  addColumn,
  reorderColumns,
  updateColumn,
  deleteColumn,
} from "@/redux/features/columnSlice";

// Tasks
import { generateTaskId } from "@/utils/generateTaskId";
import {
  addTask as addTaskAction,
  deleteTask as deleteTaskAction,
  updateTask as updateTaskAction,
  updateTaskStatus as updateTaskStatusAction,
  toggleFavorite as toggleFavoriteAction,
  updateTaskColumn,
  selectTasks,
} from "@/redux/features/taskSlice";
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

//Search and Filter Props
interface TaskBoardProps {
  searchTerm?: string;
  statusFilter?: TaskStatus | 'all';
}

export default function TaskBoard({ searchTerm = '', statusFilter = 'all' }: TaskBoardProps) {
  const dispatch: AppDispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.columns.columns);
  const userId = useSelector((state: RootState) => state.auth.token);
  const [mounted, setMounted] = useState(false);
  const tasks = useSelector((state: RootState) =>
    selectTasks(state, userId || "")
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter tasks based on search term and status
  // useMemo is used to memorize the filteredTasks array, so it only recalculates when tasks, searchTerm, or statusFilter change
  const filteredTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      // Filter by search term (task content)
      const matchesSearch = searchTerm
        ? task.content.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Filter by task status
      const matchesStatus = statusFilter === 'all'
        ? true
        : task.status === statusFilter;

      // The task must match both the search term and the status filter
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  //useMemo is used to memorize the columnsId array, so it only recalculates when columns change
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

  //Columns functions
  const hanbleAddColumn = (title: string) => {
    dispatch(addColumn(title));
  };

  const handleEditColumn = (id: Id, title: string) => {
    dispatch(updateColumn({ id, title }));
  };

  const handleDeleteColumn = (id: Id) => {
    dispatch(deleteColumn({ id }));
  };

  //Tasks functions
  function addTask(columnId: Id) {
    if (!userId) return;

    const task: Task = {
      id: generateTaskId(userId),
      content: "Add a Task",
      columnId,
      status: "default" as TaskStatus,
      isFavorite: false,
      type: "task",
      parentId: null,
    };

    dispatch(addTaskAction({ userId, task }));
    console.log(task);
  };

  function deleteTask(id: Id) {
    if (!userId) return;
    dispatch(deleteTaskAction({ userId, taskId: id }));
  }

  function updateTask(id: Id, content: string) {
    if (!userId) return;
    dispatch(updateTaskAction({ userId, taskId: id, content }));
  }

  function updateTaskStatus(id: Id, status: TaskStatus) {
    if (!userId) return;
    dispatch(updateTaskStatusAction({ userId, taskId: id, status }));
  }

  function toggleFavorite(id: Id) {
    if (!userId) return;
    dispatch(toggleFavoriteAction({ userId, taskId: id }));
  }

  //Drag and Drop functions
  function onDragStart(event: DragStartEvent) {
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

    setActiveColumn(null);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || !userId) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    //Drop a Task over another task
    if (isActiveTask && isOverTask) {
      const overTask = filteredTasks.find((task: Task) => task.id === overId);
      if (overTask) {
        dispatch(
          updateTaskColumn({
            userId,
            taskId: activeId as Id,
            newColumnId: overTask.columnId,
          })
        );
      }
    }

    const isOverAColumn = over.data.current?.type === "Column";

    //Drop a task over a column
    if (isActiveTask && isOverAColumn) {
      dispatch(
        updateTaskColumn({
          userId,
          taskId: activeId as Id,
          newColumnId: overId as Id,
        })
      );
    }
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
                  createTask={addTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  toggleFavorite={toggleFavorite}
                  updateStatus={updateTaskStatus}
                  tasks={filteredTasks.filter(
                    (task: Task) => task.columnId === column.id
                  )}
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
                  createTask={addTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  updateStatus={updateTaskStatus}
                  toggleFavorite={toggleFavorite}
                  tasks={filteredTasks.filter(
                    (task: Task) => task.columnId === activeColumn.id
                  )}
                />
              )}{" "}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  updateStatus={updateTaskStatus}
                  toggleFavorite={toggleFavorite}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
}
