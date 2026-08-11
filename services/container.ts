import PlantService from "./plants/plantService";
import { createPlantRepository } from "./plants/plantRepository";

export async function createServices(){
    const plantRepository = await createPlantRepository();

    const plantService = new PlantService(plantRepository);

    return {
        plantService,
    }
}