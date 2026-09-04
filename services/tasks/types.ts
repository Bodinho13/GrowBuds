import { Task } from "../../types/Task";

export type TaskId = string;

export type TaskRow = {
    id: string;
    growId: string | null;
    groupGrowId: string | null;
    title: string;
    dueDate: string;
    urgency: string;
    completed: number;
    recurrenceInterval: number | null;
    recurrenceUnit: string | null;
    createdAt: string;
    updatedAt: string;
    archivedAt: string | null;
    isArchived: number;
};

export interface TaskRepository {
    getAll(): Promise<Task[]>;
    getById(id: string): Promise<Task | undefined>;
}