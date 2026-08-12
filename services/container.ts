import PlantService from "./plants/plantService";
import { PlantRepository } from "./plants/plantRepository";
import { GrowRepository } from "./grows/growRepository";
import GrowService from "./grows";
import { getDatabase } from "./storage/database";
import { SQLiteStorage } from "./storage/sqliteStorage";

export async function createServices(){
    const db = await getDatabase();
    const storage = new SQLiteStorage(db);

    const plantRepository = new PlantRepository(storage);
    const growRepository = new GrowRepository(storage);

    const plantService = new PlantService(plantRepository);
    const growService = new GrowService(growRepository);

    return {
        plantService,
        growRepository,
    }
}