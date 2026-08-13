import { Grow } from "../../types/Grow";
import { SQLiteStorage } from "../storage/sqliteStorage";

import { archiveGrowSql, createGrowSql, getAllGrowsSql, getGrowByIdSql, updateGrowSql } from "./growSql";
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
        await this.storage.execute(createGrowSql, [
            grow.id,
            grow.plantId,
            grow.name,
            grow.startDate.toISOString(),
            grow.amount,
            grow.stage,
            grow.medium,
            grow.location ?? null,
            grow.weight ?? null,
            grow.createdAt.toISOString(),
            grow.updatedAt.toISOString(),
            grow.isArchived ? 1 : 0,

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
            row.updatedAt,
            row.id,
        ]);

        return changes > 0 ? grow : undefined;
    }

    async archive(grow: Grow): Promise<Grow | undefined> {
        const changes = await this.storage.execute(archiveGrowSql, [
            grow.endDate?.toISOString() ?? null,
            grow.updatedAt.toISOString(),
            grow.id,
        ]);
        return changes > 0 ? grow : undefined;
    }
}