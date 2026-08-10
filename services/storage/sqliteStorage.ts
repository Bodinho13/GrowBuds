import { SQLiteDatabase } from "expo-sqlite";
import type { Storage } from "./storage";

export class SQLiteStorage implements Storage {
    constructor(private readonly db: SQLiteDatabase) {}

    async getAll<T>(collection: string): Promise<T[]> {
        return this.db.getAllAsync<T>(
            `SELECT * FROM ${collection}`
        );
    }

    async getById<T>(collection: string, id: string): Promise<T | undefined> {
        const result =  await this.db.getFirstAsync<T>(
            `SELECT * FROM ${collection} WHERE id = ?`,
            id
        );
        return result ?? undefined;
    }

    create<T>(collection: string, item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
    update<T>(collection: string, id: string, item: T): Promise<T | undefined> {
        throw new Error("Method not implemented.");
    }
    
}