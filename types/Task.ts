import { TaskUrgency } from "./TaskUrgency";

export interface Task {
    id: string;
    growId?: string;
    growGroupId?: string;
    title: string;
    dueDate: Date;
    urgency: TaskUrgency;
    completed: boolean;
    recurrence?: {
        interval: number;
        unit: "day" | "week";
    };
    createdAt: Date;
    updatedAt: Date;
    archivedAt?: Date;
    isArchived: boolean;
}