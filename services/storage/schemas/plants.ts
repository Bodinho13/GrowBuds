export const createPlantsTableSql = `
    CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        strain TEXT,
        cross TEXT,
        breeder TEXT,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isArchived INTEGER NOT NULL DEFAULT 0
    )`
;