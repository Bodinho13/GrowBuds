import * as SQLite from "expo-sqlite";
import { createTablesSql } from "./databaseSchema";

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    const db = await SQLite.openDatabaseAsync("growbuds.db");
    await db.execAsync(createTablesSql);
    return db;
}