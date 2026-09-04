import { GrowGroup } from "../../types/GrowGroup";

export interface GrowGroupRow {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    archivedAt: string;
    isArchived: number;
}

export interface CreateGrowGroupDto {
    name: string;
}

export interface UpdateGrowGroupDto {
    name?: string;
}

export interface GrowGroupRepository {
    getAll(): Promise<GrowGroup[]>;
    getById(id: string): Promise<GrowGroup | undefined>;
    create(growGroup: GrowGroup): Promise<GrowGroup>;
    update(growGroup: GrowGroup): Promise<GrowGroup>;
}