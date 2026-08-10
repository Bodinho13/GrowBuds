import type { Plant } from "../../types/Plant";
import type { Storage } from "../storage/storage";

import { MockStorage } from "../storage/mockStorage";
import { mockPlants } from "../../constants/mockData";

const storage: Storage = new MockStorage({plants: mockPlants});

export class PlantRepository {
    async getAll(): Promise<Plant[]> {
        return storage.getAll<Plant>("plants");
    }

    async getById(id: string): Promise<Plant | undefined> {
        return storage.getById<Plant>("plants", id);
    }

    async create(plant: Plant): Promise<Plant> {
        return storage.create("plants", plant);
    }
    
    async update(plant: Plant): Promise<Plant | undefined> {
        return storage.update("plants", plant.id, plant);
    }
}