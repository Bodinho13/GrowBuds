import { CreateTaskDto } from "../../types/dto/CreateTaskDto";
import { UpdateTaskDto } from "../../types/dto/UpdateTaskDto";
import type { Task } from "../../types/Task";
import { createId } from "../../utils/id";
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

    async create(dto: CreateTaskDto): Promise<Task> {
        this.validateTarget(dto.growId, dto.growGroupId);
        const now = new Date();
        const task: Task = {
            id: createId(),
            ...dto,
            completed: false,
            createdAt: now,
            updatedAt: now,
            isArchived: false,
        };

        return this.repository.create(task);
    }

    async update(id: string, dto: UpdateTaskDto): Promise<Task | undefined> {
        const existingTask = await this.repository.getById(id);
        if(!existingTask)
            return undefined;

        this.validateTarget(dto.growId, dto.growGroupId);

        const updatedTask: Task = {
            ...existingTask,
            ...dto,
            updatedAt: new Date(),
        };

        return this.repository.update(updatedTask);
    }
    
    private validateTarget(growId?: string, growGroupId?: string): void {
        if(growId && growGroupId)
            throw new Error("A task can belong to either a grow or grow group, not both.");
        if(!growId && !growGroupId)
            throw new Error("A task must belong to either a grow or grow group.");
    }
}


export default TaskService;