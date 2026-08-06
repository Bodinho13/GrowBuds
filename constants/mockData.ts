import type { Plant } from "../types/Plant";
import type { Grow } from "../types/Grow";

import { GrowStage } from "../types/GrowStage";
import { GrowMedium } from "../types/GrowMedium";

export const mockPlants: Plant[] = [
    {
        id: "plant-001",
        name: "Northern Lights",
        strain: "Indica",
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
    },
];

export const mockGrows: Grow[] = [
    {
        id: "grow-001",
        plantId: "plant-001",
        name: "Indoor Frühling 2026",
        startDate: new Date("2026-03-01"),
        stage: GrowStage.Vegetative,
        medium: GrowMedium.Soil,
        location: "Grow Room",
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
    },
];