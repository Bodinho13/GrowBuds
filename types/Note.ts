export interface Note {
    id: string;
    growId: string;
    date: Date;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}