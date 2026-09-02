import type { Task } from "../../types/Task";
import { TaskRepository } from "./types";

class TaskService {
    constructor(
        private readonly repository: TaskRepository
    ) {}
    
    async getAll(): Promise<Task[]> {
        return this.repository.getAll();
    }

    async getById(id: string): Promise<Task | undefined> {
        return this.repository.getById(id);
    }

}

export default TaskService;