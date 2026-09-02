import { Task } from "../../types/Task";
import { SQLiteStorage } from "../storage/sqliteStorage";
import { toTask } from "./mapper";
import { getAllTasksSql, getTaskByIdSql } from "./taskSql";
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
}