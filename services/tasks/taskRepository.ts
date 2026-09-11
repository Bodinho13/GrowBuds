import { Task } from "../../types/Task";
import { SQLiteStorage } from "../storage/sqliteStorage";
import { toTask, toTaskRow } from "./mapper";
import { createTaskSql, getAllTasksSql, getTaskByIdSql, updateTaskSql } from "./taskSql";
import type {
    TaskRepository as ITaskRepository,
    TaskRow,
} from "./types";

export class TaskRepository implements ITaskRepository {
    constructor(
        private readonly storage: SQLiteStorage
    ) {}

    async getAll(): Promise<Task[]> {
        const rows = await this.storage.getAll<TaskRow>(
            getAllTasksSql
        );

        return rows.map(toTask);
    }

    async getById(id: string): Promise<Task | undefined> {
        const row = await this.storage.getFirst<TaskRow>(
            getTaskByIdSql,
            [id]
        );

        return row ? toTask(row) : undefined;
    }

    async create(task: Task): Promise<Task> {
        const row = toTaskRow(task);
        await this.storage.execute(createTaskSql, [
            row.id,
            row.growId,
            row.growGroupId,
            row.title,
            row.dueDate,
            row.urgency,
            row.completed,
            row.recurrenceInterval,
            row.recurrenceUnit,
            row.createdAt,
            row.updatedAt,
            row.archivedAt,
            row.isArchived,
        ]);
        return task;
    }

    async update(task: Task): Promise<Task> {
        const row = toTaskRow(task);
        await this.storage.execute(updateTaskSql, [
            row.growId,
            row.growGroupId,
            row.title,
            row.dueDate,
            row.urgency,
            row.completed,
            row.recurrenceInterval,
            row.recurrenceUnit,
            row.updatedAt,
            row.archivedAt,
            row.isArchived,
            row.id,
        ]);

        return task;
    }
}