
export const createTasksTableSql = `
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        growId TEXT,
        growGroupId TEXT,
        title TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        urgency TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        recurrenceInterval INTEGER,
        recurrenceUnit TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        archivedAt TEXT,
        isArchived INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY (growId) REFERENCES grows(id),
        FOREIGN KEY (growGroupId) REFERENCES grow_groups(id)
    );
`;