import { TaskUrgency } from "../TaskUrgency";

export interface CreateTaskDto {
    growId?: string;
    growGroupId?: string;
    title: string;
    dueDate: Date;
    urgency: TaskUrgency;
    recurrence?: {
        interval: number;
        unit: "day" | "week";
    }
}