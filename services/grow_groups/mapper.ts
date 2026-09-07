import { GrowGroup } from "../../types/GrowGroup";
import { GrowGroupRow } from "./types";

export function toGrowGroup(row: GrowGroupRow): GrowGroup {
    return {
        id: row.id,
        name: row.name,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        archivedAt: row.archivedAt ? new Date(row.archivedAt) : undefined,
        isArchived: row.isArchived === 1,
    };
}

export function toGrowGroupRow(gg: GrowGroup): GrowGroupRow {
    return {
        id: gg.id,
        name: gg.name,
        createdAt: gg.createdAt.toISOString(),
        updatedAt: gg.updatedAt.toISOString(),
        archivedAt: gg.archivedAt ? gg.archivedAt.toISOString() : null,
        isArchived: gg.isArchived ? 1 : 0,
    };
}