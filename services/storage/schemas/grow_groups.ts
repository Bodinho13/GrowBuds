
export const createGrowGroupsTableSql = `
    CREATE TABLE IF NOT EXISTS grow_groups (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        archivedAt TEXT,
        isArchived INTEGER NOT NULL DEFAULT 0,
    );
`;