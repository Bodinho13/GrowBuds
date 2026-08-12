import { GrowMedium } from "../GrowMedium";
import { GrowStage } from "../GrowStage";

export interface CreateGrowDto {
    plantId: string;
    name: string;
    startDate: Date;
    amount: number;
    stage: GrowStage;
    medium: GrowMedium;
    location?: string;
    weight?: number;
}