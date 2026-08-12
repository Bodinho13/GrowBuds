export const createGrowsTableSql = `
    CREATE TABLE IF NOT EXISTS grows (
        id TEXT PRIMARY KEY NOT NULL,
        plant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        amount INTEGER NOT NULL,
        stage TEXT NOT NULL,
        medium TEXT NOT NULL,
        location TEXT,
        weight REAL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isArchived INTEGER NOT NULL DEFAULT 0,
        
        FOREIGN KEY (plant_id) REFERENCES plants(id)
    );
`;
