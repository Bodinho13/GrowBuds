import { GrowGroup } from "../../types/GrowGroup";
import { SQLiteStorage } from "../storage/sqliteStorage";
import { createGrowGroupSql, getAllGrowGroupSql, getGrowGroupByIdSql, updateGrowGroupSql } from "./growGroupSql";
import { toGrowGroup, toGrowGroupRow } from "./mapper";
import { GrowGroupRow, type GrowGroupRepository as IGrowGroupRepository} from "./types";

export class GrowGroupRepository implements IGrowGroupRepository {
    constructor(private readonly storage: SQLiteStorage) {}
    async getAll(): Promise<GrowGroup[]> {
        const rows = await this.storage.getAll<GrowGroupRow>(getAllGrowGroupSql);
        return rows.map(toGrowGroup);
    }

    async getById(id: string): Promise<GrowGroup | undefined> {
        const row = await this.storage.getFirst<GrowGroupRow>(getGrowGroupByIdSql, [id]);

        return row ? toGrowGroup(row) : undefined;
    }

    async create(growGroup: GrowGroup): Promise<GrowGroup> {
        const row = toGrowGroupRow(growGroup);

        await this.storage.execute(createGrowGroupSql, [
            row.id,
            row.name,
            row.createdAt,
            row.updatedAt,
            row.archivedAt,
            row.isArchived,
        ]);

        return growGroup;
    }

    async update(growGroup: GrowGroup): Promise<GrowGroup> {
        const row = toGrowGroupRow(growGroup);

        await this.storage.execute(updateGrowGroupSql, [
            row.name,
            row.updatedAt,
            row.archivedAt,
            row.isArchived,
        ]);

        return growGroup;
    }

}