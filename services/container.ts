import PlantService from "./plants/plantService";
import { PlantRepository } from "./plants/plantRepository";
import { GrowRepository } from "./grows/growRepository";
import GrowService from "./grows";
import { TaskRepository } from "./tasks/taskRepository";
import TaskService from "./tasks";
import { getDatabase } from "./storage/database";
import { SQLiteStorage } from "./storage/sqliteStorage";

export async function createServices(){
    const db = await getDatabase();
    const storage = new SQLiteStorage(db);

    const plantRepository = new PlantRepository(storage);
    const growRepository = new GrowRepository(storage);
    const taskRepository = new TaskRepository(storage);

    const plantService = new PlantService(plantRepository);
    const growService = new GrowService(growRepository);
    const taskService = new TaskService(taskRepository);

    return {
        plantService,
        growService,
        taskService,
    }
}