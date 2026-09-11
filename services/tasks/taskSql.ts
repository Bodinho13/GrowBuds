export const getAllTasksSql = `
    SELECT * FROM tasks
`;

export const getTaskByIdSql = `
    SELECT * FROM tasks
    WHERE id = ?
`;

export const createTaskSql = `
    INSERT INTO tasks (
        id,
        growId,
        growGroupId,
        title,
        dueDate,
        urgency,
        completed,
        recurrenceInterval.
        recurrenceUnit,
        createdAt,
        updatedAt,
        archivedAt,
        isArchived
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;