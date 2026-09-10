
import { PlantRepository } from "./plants/plantRepository";
import PlantService from "./plants/plantService";
import { GrowRepository } from "./grows/growRepository";
import GrowService from "./grows";
import { TaskRepository } from "./tasks/taskRepository";
import TaskService from "./tasks";
import { GrowGroupRepository } from "./grow_groups/growGroupRepository";
import GrowGroupService from "./grow_groups/growGroupService";
import { getDatabase } from "./storage/database";
import { SQLiteStorage } from "./storage/sqliteStorage";

export async function createServices(){
    const db = await getDatabase();
    const storage = new SQLiteStorage(db);

    const plantRepository = new PlantRepository(storage);
    const growRepository = new GrowRepository(storage);
    const growGroupRepository = new GrowGroupRepository(storage);
    const taskRepository = new TaskRepository(storage);

    const plantService = new PlantService(plantRepository);
    const growService = new GrowService(growRepository);
    const growGroupService = new GrowGroupService(growGroupRepository);
    const taskService = new TaskService(taskRepository);

    return {
        plantService,
        growService,
        growGroupService,
        taskService,
    }
}