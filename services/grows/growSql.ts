export const getAllGrowsSql = `
    SELECT * FROM grows
`;

export const getGrowByIdSql = `
    SELECT * FROM grows
    WHERE id = ?
`;

export const createGrowSql = `
    INSERT INTO grows (
        id,
        plantId,
        name,
        startDate,
        endDate,
        amount,
        stage,
        medium,
        location,
        weight,
        createdAt,
        updatedAt,
        isArchived
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;