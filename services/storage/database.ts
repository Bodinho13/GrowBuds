import * as SQLite from "expo-sqlite";
import { createTablesSql } from "./databaseSchema";
import { migrateDatabase } from "./migrations";

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    const db = await SQLite.openDatabaseAsync("growbuds.db");
    await db.execAsync(`PRAGMA foreign_keys= ON;`);
    await db.execAsync(createTablesSql);
    await migrateDatabase(db);

    return db;
}

export async function initializeDatabase(): Promise<void> {
    await getDatabase();
    console.log("SQLite database initialized");
}