export type Id = string | number;
export type TaskStatus = "on_time" | "delayed" | "on_going" | "urgent";

export type Column = {
    id: Id;
    title: string;
}

export type Task = {
    id: Id;
    content: string;
    columnId: Id;
    isFavorite?: boolean;
    status?: TaskStatus;
}