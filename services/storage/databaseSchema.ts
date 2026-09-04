import { createPlantsTableSql } from "./schemas/plants"
import { createGrowsTableSql } from "./schemas/grows";
import { createGrowGroupsTableSql } from "./schemas/grow_groups";
import { createTasksTableSql } from "./schemas/tasks";

export const createTablesSql = `
    ${createPlantsTableSql}
    ${createGrowGroupsTableSql}
    ${createGrowsTableSql}
    ${createTasksTableSql}
`;