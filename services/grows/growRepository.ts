import { Grow } from "../../types/Grow";
import { SQLiteStorage } from "../storage/sqliteStorage";

import { getAllGrowsSql, getGrowByIdSql } from "./growSql";
import { toGrow } from "./mapper";
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
}