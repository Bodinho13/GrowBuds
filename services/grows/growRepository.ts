import { Grow } from "../../types/Grow";
import { SQLiteStorage } from "../storage/sqliteStorage";

import { createGrowSql, getAllGrowsSql, getGrowByIdSql, updateGrowSql } from "./growSql";
import { toGrow, toGrowRow } from "./mapper";
import { GrowRow } from "./types";
import type { GrowRepository as IGrowRepository } from "./types";

export class GrowRepository implements IGrowRepository{
    constructor(
        private readonly storage: SQLiteStorage
    ) {}

    async getAll(): Promise<Grow[]> {
        const rows = await this.storage.getAll<GrowRow>(getAllGrowsSql);
        return rows.map(toGrow);
    }

    async getById(id: string): Promise<Grow | undefined> {
        const row = await this.storage.getFirst<GrowRow>(
            getGrowByIdSql, [id]
        );
        return row ? toGrow(row) : undefined;
    }

    async create(grow: Grow): Promise<Grow> {
        const row = toGrowRow(grow);
        await this.storage.execute(createGrowSql, [
            row.id,
            row.plantId,
            row.name,
            row.startDate,
            row.amount,
            row.stage,
            row.medium,
            row.location,
            row.weight,
            row.createdAt,
            row.updatedAt,
            row.isArchived,

        ]);
        return grow;
    }

    async update(grow: Grow): Promise<Grow | undefined> {
        const row = toGrowRow(grow);
        const changes = await this.storage.execute(updateGrowSql, [
            row.name,
            row.amount,
            row.stage,
            row.medium,
            row.location,
            row.weight,
            row.endDate,
            row.updatedAt,
            row.isArchived,
            row.id,
        ]);

        return changes > 0 ? grow : undefined;
    }
}