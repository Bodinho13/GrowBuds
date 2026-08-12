import type { Plant } from "../../types/Plant";

import { SQLiteStorage } from "../storage/sqliteStorage";

import { getAllPlantsSql, getPlantByIDSql, createPlantSql, updatePlantSql } from "./plantSql";
import { toPlant, toPlantRow } from "./mapper";
import { PlantRow } from "./types";
import type { PlantRepository as IPlantRepository } from "./types";

export class PlantRepository implements IPlantRepository {
    constructor(
        private readonly storage: SQLiteStorage
    ) {}

    async getAll(): Promise<Plant[]> {
        const rows = await this.storage.getAll<PlantRow>(getAllPlantsSql);
        return rows.map(toPlant);
    }

    async getById(id: string): Promise<Plant | undefined> {
        const row = await this.storage.getFirst<PlantRow>(getPlantByIDSql, [id]);
        return row ? toPlant(row) : undefined;
    }

    async create(plant: Plant): Promise<Plant> {
        const row = toPlantRow(plant);
        await this.storage.execute(createPlantSql, [
            row.id,
            row.name,
            row.strain,
            row.cross,
            row.breeder,
            row.notes,
            row.createdAt,
            row.updatedAt,
            row.isArchived,
        ]);
        return plant;
    }
    
    async update(plant: Plant): Promise<Plant | undefined> {
        const row = toPlantRow(plant);
        const changes = await this.storage.execute(updatePlantSql, [
            row.name,
            row.strain,
            row.cross,
            row.breeder,
            row.notes,
            row.createdAt,
            row.updatedAt,
            row.isArchived,
            row.id,
        ]);
        return changes > 0 ? plant : undefined;
    } 
}