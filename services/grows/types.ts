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
    //create(plant: Grow): Promise<Grow>;
    //update(plant: Grow): Promise<Grow | undefined>;
};