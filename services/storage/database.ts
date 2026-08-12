import * as SQLite from "expo-sqlite";
import { createTablesSql } from "./databaseSchema";

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    const db = await SQLite.openDatabaseAsync("growbuds.db");
    await db.execAsync(`PRAGMA foreign_keys= ON;`);
    await db.execAsync(createTablesSql);
    return db;
}

export async function initializeDatabase(): Promise<void> {
    const db = await getDatabase();
    console.log("SQLite database initialized");
}