import type { Plant } from "../../types/Plant";

import { mockPlants } from "../../constants/mockData";

class PlantService {
    
    async getAll(): Promise<Plant[]> {
        return mockPlants;
    }

    async getById(id: string): Promise<Plant | undefined> {
        return mockPlants.find(plant => plant.id === id);
    }

}

export default new PlantService();