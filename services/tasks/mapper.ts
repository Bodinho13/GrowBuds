import type { Task } from "../../types/Task";
import { TaskUrgency } from "../../types/TaskUrgency";
import { TaskRow } from "./types";

export function toTask(row: TaskRow): Task {
    return {
        id: row.id,
        growId: row.growId ?? undefined,
        growGroupId: row.growGroupId ?? undefined,
        title: row.title,
        dueDate: new Date(row.dueDate),
        urgency: row.urgency as TaskUrgency,
        completed: row.completed === 1,
        recurrence: row.recurrenceInterval !== null && row.recurrenceUnit !== null ? {
                interval: row.recurrenceInterval,
                unit: row.recurrenceUnit as "day" | "week"
            } : undefined,
        lastCompletedAt: row.lastCompletedAt ? new Date(row.lastCompletedAt) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        archivedAt: row.archivedAt ? new Date(row.archivedAt) : undefined,
        isArchived: row.isArchived === 1,
    };
}

export function toTaskRow(task: Task): TaskRow {
    return {
        id: task.id,
        growId: task.growId ?? null,
        growGroupId: task.growGroupId ?? null,
        title: task.title,
        dueDate: task.dueDate.toISOString(),
        urgency: task.urgency,
        completed: task.completed ? 1 : 0,
        recurrenceInterval: task.recurrence?.interval ?? null,
        recurrenceUnit: task.recurrence?.unit ?? null,
        lastCompletedAt: task.lastCompletedAt?.toISOString() ?? null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        archivedAt: task.archivedAt?.toISOString() ?? null,
        isArchived: task.isArchived ? 1 : 0,
    };
}