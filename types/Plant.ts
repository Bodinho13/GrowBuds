export interface Plant {
    id: string;
    name: string;
    strain?: string;
    cross?: string;
    breeder?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    archivedAt?: Date;
    isArchived: boolean;
}