export const getAllGrowGroupSql = `
    SELECT * FROM grow_groups
`;

export const getGrowGroupByIdSql = `
    SELECT * FROM grow_groups
    WHERE id = ?
`;

export const createGrowGroupSql = `
    INSERT INTO grow_groups(
        id,
        name,
        createdAt,
        updatedAt,
        archivedAt,
        isArchived,
    )
    VALUES (?, ?, ?, ?, ?, ?)
`;

export const updateGrowGroupSql = `
    UPDATE grow_groups
        SET name = ?, updatedAt = ?, archivedAt = ?, isArchived = ?
    WHERE id = ?
`;