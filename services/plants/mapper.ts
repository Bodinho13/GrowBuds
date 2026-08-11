import type { Plant } from "../../types/Plant";
import { PlantRow } from "./types";

export function toPlant(row: PlantRow): Plant {
    return {
        id: row.id,
        name: row.name,
        strain: row.strain ?? undefined,
        cross: row.cross ?? undefined,
        breeder: row.breeder ?? undefined,
        notes: row.notes ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        isArchived: row.isArchived === 1,
    };
}

export function toPlantRow(plant: Plant): PlantRow {
    return {
        id: plant.id,
        name: plant.name,
        strain: plant.strain ?? null,
        cross: plant.cross ?? null,
        breeder: plant.breeder ?? null,
        notes: plant.notes ?? null,
        createdAt: plant.createdAt.toISOString(),
        updatedAt: plant.updatedAt.toISOString(),
        isArchived: plant.isArchived ? 1 : 0,
    };
}