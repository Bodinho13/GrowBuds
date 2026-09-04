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
        growGroupId,
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
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const updateGrowSql = `
    UPDATE grows
        SET growGroupId = ?, name = ?, amount = ?, stage = ?, medium = ?, location = ?, weight = ?, endDate = ?, updatedAt = ?, isArchived = ?
    WHERE id = ?
`;