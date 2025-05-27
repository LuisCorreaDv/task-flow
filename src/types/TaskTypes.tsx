export type Id = string | number;
export type TaskStatus =
  | "on_time"
  | "delayed"
  | "on_going"
  | "urgent"
  | "default";

// Types for nodes
interface BaseNode {
  id: Id;
  parentId: Id | null;
}

// Made task a child of column
export interface Task extends BaseNode {
  type: "task";
  content: string;
  columnId: Id;
  isFavorite: boolean;
  status: TaskStatus;
  version: number; // Track changes for optimistic locking
  lastModified: number; // Timestamp of last modification
}

// Columns are now a separate entity
// and can have multiple tasks
export interface Column extends BaseNode {
  type: "column";
  title: string;
  taskIds: Id[]; // Array of task IDs for a column
}

// Tree structure that contains columns and tasks
export interface TreeNode {
  columns: {
    [id: string]: Column;
  };
  tasks: {
    [id: string]: Task;
  };
}

// General state for the application
// This is a map of userId to their respective tree structure
export interface TasksState {
  [userId: string]: TreeNode;
}
