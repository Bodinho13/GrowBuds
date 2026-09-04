import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDatabase(db: SQLiteDatabase) {
    const result = await db.getFirstAsync<{ user_version: number}>(
        "PRAGMA user_version;"
    );

    let currentVersion = result?.user_version ?? 0;

    if(currentVersion < 1) {
        await db.execAsync(`
            PRAGMA user_version = 1;    
        `)
        currentVersion = 1;
    }

    if(currentVersion < 2) {
        await db.execAsync(`
           ALTER TABLE plants
           ADD COLUMN archivedAt TEXT; 
        `);

        await db.execAsync(`
            PRAGMA user_version = 2;    
        `);
        currentVersion = 2;
    }

    if(currentVersion < 3) {
        await db.execAsync(`
           ALTER TABLE grows
           ADD COLUMN growGroupId TEXT; 
        `);

        await db.execAsync(`
           PRAGMA user_version = 3; 
        `);

        currentVersion = 3;
    }
}