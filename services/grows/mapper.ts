import type { Grow } from "../../types/Grow";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";
import { GrowRow } from "./types";

export function toGrow(row: GrowRow): Grow {
    return {
        id: row.id,
        plantId: row.plantId,
        name: row.name,
        startDate: new Date(row.startDate),
        endDate: row.endDate ? new Date(row.endDate) : undefined,
        amount: row.amount,
        stage: row.stage as GrowStage,
        medium: row.medium as GrowMedium,
        location: row.location ?? undefined,
        weight: row.weight ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        isArchived: row.isArchived === 1,
    };
}