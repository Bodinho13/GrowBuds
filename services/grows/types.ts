import { Grow } from "../../types/Grow";

export type GrowId = string;

export interface GrowRow {
    id: string;
    plantId: string;
    name: string;
    startDate: string;
    endDate: string | null;
    amount: number;
    stage: string;
    medium: string;
    location: string | null;
    weight: number | null;
    createdAt: string;
    updatedAt: string;
    isArchived: number;
}

export interface GrowRepository {
    getAll(): Promise<Grow[]>;
    getById(id: string): Promise<Grow | undefined>;
    create(grow: Grow): Promise<Grow>;
    update(grow: Grow): Promise<Grow | undefined>;
    archive(grow: Grow): Promise<Grow | undefined>;
};