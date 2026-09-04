import { GrowStage } from "./GrowStage";
import { GrowMedium } from "./GrowMedium";

export interface Grow {
    id: string;
    plantId: string;
    growGroupId?: string;
    name: string;
    startDate: Date;
    endDate?: Date;
    amount: number;
    stage: GrowStage;
    medium: GrowMedium;
    location?: string;
    weight?: number;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}