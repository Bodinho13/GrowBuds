import { GrowMedium } from "../GrowMedium";
import { GrowStage } from "../GrowStage";

export interface UpdateGrowDto {
    name?: string;
    amount?: number;
    stage?: GrowStage;
    medium?: GrowMedium;
    location?: string;
    weight?: number;
}