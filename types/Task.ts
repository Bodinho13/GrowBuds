import { TaskUrgency } from "./TaskUrgency";

export interface Task {
    id: string;
    growId: string;
    title: string;
    dueDate: Date;
    urgency: TaskUrgency;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}