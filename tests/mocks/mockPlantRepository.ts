import { mockPlants } from "../../constants/mockData";
import { Plant } from "../../types/Plant";

export class MockPlantRepository {
    private plants: Plant[] = [...mockPlants];

    async getAll(): Promise<Plant[]> {
        return this.plants;
    }

    async getById(id: string): Promise<Plant | undefined> {
        return this.plants.find(plant => plant.id === id);
    }

    async create(plant: Plant): Promise<Plant> {
        this.plants.push(plant);
        return plant;
    }

    async update(plant: Plant): Promise<Plant | undefined> {
        const index = this.plants.findIndex(existing => existing.id === plant.id);
        if(index === -1)
            return undefined;
        this.plants[index] = plant;
        return plant;
    }
}