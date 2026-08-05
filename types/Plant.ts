export interface Plant {
    id: string;
    name: string;
    strain?: string;
    parents?: string;
    breeder?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}