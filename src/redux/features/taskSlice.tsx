import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Id, Task, TasksState } from "@/types/TaskTypes";
import { RootState } from "../store";

const initialState: TasksState = {};

// Selector for obtaining tasks by user ID
export const selectTasks = createSelector(
  [(state: RootState) => state.tasks, (_, userId: string) => userId],
  (tasks, userId): Task[] => {
    const userTree = tasks[userId];
    if (!userTree) return [];
    return Object.values(userTree.tasks);
  }
);

// Selector for obtaining tasks by column ID
export const selectColumnTasks = createSelector(
  [
    (state: RootState) => state.tasks,
    (_, userId: string) => userId,
    (_, __, columnId: Id) => columnId
  ],
  (tasks, userId, columnId): Task[] => {
    const userTree = tasks[userId];
    if (!userTree) return [];
    const column = userTree.columns[columnId];
    if (!column) return [];
    return column.taskIds.map(taskId => userTree.tasks[taskId]).filter(Boolean);
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ userId: string; task: Task }>) => {
      const { userId, task } = action.payload;
      
      if (!state[userId]) {
        state[userId] = { columns: {}, tasks: {} };
      }

      // Add task to user tree
      state[userId].tasks[task.id] = {
        ...task,
        type: 'task',
        parentId: task.columnId,
        status: task.status || 'default',
        isFavorite: task.isFavorite || false
      };

      // Update reference in parent column
      if (!state[userId].columns[task.columnId]) {
        state[userId].columns[task.columnId] = {
          id: task.columnId,
          type: 'column',
          title: '',
          parentId: null,
          taskIds: []
        };
      }
      state[userId].columns[task.columnId].taskIds.push(task.id);
    },

    deleteTask: (state, action: PayloadAction<{ userId: string; taskId: Id }>) => {
      const { userId, taskId } = action.payload;
      if (!state[userId]) return;

      const task = state[userId].tasks[taskId];
      if (!task) return;

      // Delete reference from parent column
      const column = state[userId].columns[task.columnId];
      if (column) {
        column.taskIds = column.taskIds.filter(id => id !== taskId);
      }

      // Delete task from user tree
      delete state[userId].tasks[taskId];
    },

    updateTask: (state, action: PayloadAction<{ userId: string; taskId: Id; content: string }>) => {
      const { userId, taskId, content } = action.payload;
      if (!state[userId]?.tasks[taskId]) return;
      
      state[userId].tasks[taskId].content = content;
    },

    updateTaskStatus: (state, action: PayloadAction<{ userId: string; taskId: Id; status: string }>) => {
      const { userId, taskId, status } = action.payload;
      if (!state[userId]?.tasks[taskId]) return;

      state[userId].tasks[taskId].status = status as Task['status'];
    },

    toggleFavorite: (state, action: PayloadAction<{ userId: string; taskId: Id }>) => {
      const { userId, taskId } = action.payload;
      if (!state[userId]?.tasks[taskId]) return;

      state[userId].tasks[taskId].isFavorite = !state[userId].tasks[taskId].isFavorite;
    },

    updateTaskColumn: (state, action: PayloadAction<{ userId: string; taskId: Id; newColumnId: Id }>) => {
      const { userId, taskId, newColumnId } = action.payload;
      if (!state[userId]) return;

      const task = state[userId].tasks[taskId];
      if (!task) return;

      // Delete reference from old column
      const oldColumn = state[userId].columns[task.columnId];
      if (oldColumn) {
        oldColumn.taskIds = oldColumn.taskIds.filter(id => id !== taskId);
      }

      // Update task's column
      task.columnId = newColumnId;
      task.parentId = newColumnId;

      // Add reference to new column
      if (!state[userId].columns[newColumnId]) {
        state[userId].columns[newColumnId] = {
          id: newColumnId,
          type: 'column',
          title: '',
          parentId: null,
          taskIds: []
        };
      }
      state[userId].columns[newColumnId].taskIds.push(taskId);
    }
  }
});

export const { addTask, deleteTask, updateTask, updateTaskStatus, toggleFavorite, updateTaskColumn } = taskSlice.actions;
export default taskSlice.reducer;
