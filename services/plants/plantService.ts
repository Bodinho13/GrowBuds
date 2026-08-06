import type { Plant } from "../../types/Plant";

import { mockPlants } from "../../constants/mockData";

class PlantService {
    
    async getPlants(): Promise<Plant[]> {
        return mockPlants;
    }

    async getPlant(id: string): Promise<Plant | undefined> {
        return mockPlants.find(plant => plant.id === id);
    }

}

export default new PlantService();