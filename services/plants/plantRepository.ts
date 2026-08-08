import type { Plant } from "../../types/Plant";

import { mockPlants } from "../../constants/mockData";

export class PlantRepository {
    async getAll(): Promise<Plant[]> {
        return mockPlants;
    }

    async getById(id: string): Promise<Plant | undefined> {
        return mockPlants.find(plant => plant.id === id);
    }

    async create(plant: Plant): Promise<Plant> {
        mockPlants.push(plant);
        return plant;
    }
    
    async update(plant: Plant): Promise<Plant | undefined> {
        const index = mockPlants.findIndex(existingPlant => existingPlant.id === plant.id);
        if(index === -1) 
            return undefined;
        mockPlants[index] = plant;
        return plant;
    }
}