import { GrowStage } from "./GrowStage";
import { GrowMedium } from "./GrowMedium";

export interface Grow {
    id: string;
    plantId: string;
    name: string;
    startDate: Date;
    endDate?: Date;
    stage: GrowStage;
    medium: GrowMedium;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
}