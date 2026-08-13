export const createGrowsTableSql = `
    CREATE TABLE IF NOT EXISTS grows (
        id TEXT PRIMARY KEY NOT NULL,
        plantId TEXT NOT NULL,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        amount INTEGER NOT NULL,
        stage TEXT NOT NULL,
        medium TEXT NOT NULL,
        location TEXT,
        weight REAL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isArchived INTEGER NOT NULL DEFAULT 0,
        
        FOREIGN KEY (plantId) REFERENCES plants(id)
    );
`;
