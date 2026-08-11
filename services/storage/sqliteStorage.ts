import { SQLiteBindParams, SQLiteDatabase } from "expo-sqlite";

export class SQLiteStorage {
    constructor(private readonly db: SQLiteDatabase) {}

    async getAll<T>(sql: string, params: SQLiteBindParams = []): Promise<T[]> {
        return this.db.getAllAsync<T>(sql, params);
    }

    async getFirst<T>(sql: string, params: SQLiteBindParams = []): Promise<T | undefined> {
        const result =  await this.db.getFirstAsync<T>(sql, params);
        return result ?? undefined;
    }

    async execute(sql: string, params: SQLiteBindParams = []): Promise<number> {
        const result = await this.db.runAsync(sql, params);
        return result.changes;
    }
    
}