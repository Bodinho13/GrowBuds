export const getAllTasksSql = `
    SELECT * FROM tasks
`;

export const getTaskByIdSql = `
    SELECT * FROM tasks
    WHERE id = ?
`;