import { Plant } from "../../types/Plant";

export type PlantId = string;

export type PlantRow = {
    id: string;
    name: string;
    strain: string | null;
    cross: string | null;
    breeder: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    isArchived: number;
};

export interface PlantRepository {
    getAll(): Promise<Plant[]>;
    getById(id: string): Promise<Plant | undefined>;
    create(plant: Plant): Promise<Plant>;
    update(plant: Plant): Promise<Plant | undefined>;
};