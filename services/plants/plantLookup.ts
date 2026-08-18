import { Plant } from "../../types/Plant";

export function createPlantNameLookup(plants: Plant[]): Record<string, string> {
    return Object.fromEntries(plants.map((plant) => [plant.id, plant.name]));
}