export interface Measurement {
    id: string;
    growId: string;
    date: Date;
    height?: number;
    ph?: number;
    ec?: number; //electrical conductivity
    temperature?: number;
    humidity?: number;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}