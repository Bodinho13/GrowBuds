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
        amount,
        stage,
        medium,
        location,
        weight,
        createdAt,
        updatedAt,
        isArchived
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const updateGrowSql = `
    UPDATE grows
        SET name = ?, amount = ?, stage = ?, medium = ?, location = ?, weight = ?, updatedAt = ?
    WHERE id = ?
`;

export const archiveGrowSql = `
    UPDATE grows
    SET endDate = ?, isArchived = 1, updatedAt = ?
    WHERE id = ?
`;