import { TaskStatus } from "./TaskStatus";
import { TaskUrgency } from "./TaskUrgency";

export interface Task {
    id: string;
    growId?: string;
    growGroupId?: string;
    title: string;
    dueDate: Date;
    urgency: TaskUrgency;
    status: TaskStatus;
    completed: boolean;
    recurrence?: {
        interval: number;
        unit: "day" | "week";
        timeToReopen?: number;
    };
    leadTimeDays?: number;
    lastCompletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    archivedAt?: Date;
    isArchived: boolean;
}