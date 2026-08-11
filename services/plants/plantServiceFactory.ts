import { createPlantRepository } from "./plantRepository";
import PlantService from "./plantService";

export async function createPlantService(): Promise<PlantService> {
    const repository = await createPlantRepository();
    return new PlantService(repository);
}