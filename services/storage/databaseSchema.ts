import { createPlantsTableSql } from "./schemas/plants"
import { createGrowsTableSql } from "./schemas/grows";

export const createTablesSql = `
    ${createPlantsTableSql}
    ${createGrowsTableSql}
`;