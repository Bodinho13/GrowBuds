import { TaskUrgency } from "../TaskUrgency";

export interface UpdateTaskDto {
    growId?: string;
    growGroupId?: string;
    title?: string;
    dueDate?: Date;
    urgency?: TaskUrgency;
    completed?: boolean;
    recurrence?: {
        interval: number;
        unit: "day" | "week";
    };
}