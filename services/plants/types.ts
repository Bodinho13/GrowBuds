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