import { GrowGroup } from "../../types/GrowGroup";
import { GrowGroupRow } from "./types";

export function toGrowGroup(row: GrowGroupRow): GrowGroup {
    return {
        id: row.id,
        name: row.name,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        archivedAt: new Date(row.archivedAt),
        isArchived: row.isArchived === 1,
    };
}

export function toGrowGroupRow(gg: GrowGroup): GrowGroupRow {
    return {
        id: gg.id,
        name: gg.name,
        createdAt: gg.createdAt.toISOString(),
        updatedAt: gg.updatedAt.toISOString(),
        archivedAt: gg.archivedAt.toISOString(),
        isArchived: gg.isArchived ? 1 : 0,
    };
}