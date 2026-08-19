export const getAllPlantsSql = `
    SELECT * FROM plants
`;

export const getPlantByIDSql = `
    SELECT * FROM plants
    WHERE id = ?
`;

export const createPlantSql = `
    INSERT INTO plants (
        id,
        name,
        strain,
        cross,
        breeder,
        notes,
        createdAt,
        updatedAt,
        isArchived
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const updatePlantSql = `
    UPDATE plants 
        SET name = ?, strain = ?, cross = ?, breeder = ?, notes = ?, createdAt = ?, updatedAt = ?, archivedAt = ?, isArchived = ?
    WHERE id = ?
`;