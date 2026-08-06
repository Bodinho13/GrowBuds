import type { Task } from "../../types/Task";

//import { mockPlants } from "../../constants/mockData";

class TaskService {
    
    async getTasks(): Promise<Task[]> {
        return [];
    }

    async getTask(id: string): Promise<Task | undefined> {
        //return mockPlants.find(plant => plant.id === id);
        return undefined;
    }

}

export default new TaskService();