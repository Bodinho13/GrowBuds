import type { Task } from "../../types/Task";
import { TaskUrgency } from "../../types/TaskUrgency";
import { TaskRow } from "./types";

export function toTask(row: TaskRow): Task {
    return {
        id: row.id,
        growId: row.growId,
        title: row.title,
        dueDate: new Date(row.dueDate),
        urgency: row.urgency as TaskUrgency,
        completed: row.completed === 1,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        archivedAt: row.archivedAt ? new Date(row.archivedAt) : undefined,
        isArchived: row.isArchived === 1,
    };
}

export function toTaskRow(task: Task): TaskRow {
    return {
        id: task.id,
        growId: task.id,
        title: task.title,
        dueDate: task.dueDate.toISOString(),
        urgency: task.urgency,
        completed: task.completed ? 1 : 0,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        archivedAt: task.archivedAt?.toISOString() ?? null,
        isArchived: task.isArchived ? 1 : 0,
    };
}