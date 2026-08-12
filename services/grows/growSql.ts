export const getAllGrowsSql = `
    SELECT * FROM grows
`;

export const getGrowByIdSql = `
    SELECT * FROM grows
    WHERE id = ?
`;