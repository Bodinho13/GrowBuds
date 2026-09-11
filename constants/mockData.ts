import type { Plant } from "../types/Plant";
import type { Grow } from "../types/Grow";

import { GrowStage } from "../types/GrowStage";
import { GrowMedium } from "../types/GrowMedium";
import { GrowGroup } from "../types/GrowGroup";

export const mockPlants: Plant[] = [
    {
        id: "plant-001",
        name: "Northern Lights",
        strain: "Indica",
        notes: "Mock Data for a Plant",
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
    },
];

export const mockGrows: Grow[] = [
    {
        id: "grow-001",
        plantId: "plant-001",
        growGroupId: "group-001",
        name: "Indoor Frühling 2026",
        startDate: new Date("2026-03-01"),
        amount: 1,
        stage: GrowStage.Vegetative,
        medium: GrowMedium.Soil,
        location: "Grow Room",
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
    },
    {
        id: "grow-002",
        plantId: "plant-002",
        growGroupId: "group-001",
        name: "Blueberry",
        startDate: new Date("2026-04-04T00:00:00.000Z"),
        endDate: undefined,
        amount: 2,
        stage: GrowStage.Vegetative,
        medium: GrowMedium.Soil,
        location: undefined,
        weight: undefined,
        createdAt: new Date("2026-04-05T00:00:00.000Z"),
        updatedAt: new Date("2026-04-06T00:00:00.000Z"),
        isArchived: false,
    },
];

export const mockGrowGroups: GrowGroup[] = [
    {
        id: "group-001",
        name: "Sommer 26 Zelt 1",
        createdAt: new Date("2026-06-01"),
        updatedAt: new Date("2026-06-20"),
        isArchived: false
    },
];
