import { CreateTaskDto } from "../../types/dto/CreateTaskDto";
import { UpdateTaskDto } from "../../types/dto/UpdateTaskDto";
import type { Task } from "../../types/Task";
import { TaskStatus } from "../../types/TaskStatus";
import { createId } from "../../utils/id";
import { getTaskStatus } from "../../utils/taskStatus";
import { TaskRepository } from "./types";

class TaskService {
    constructor(
        private readonly repository: TaskRepository
    ) {}

    async getAll(): Promise<Task[]> {
        const tasks = await this.repository.getAll();
        const now = new Date();

        return tasks.map((task) => ({
            ...task,
            status: getTaskStatus(task, now),
        }));
    }

    async getById(id: string): Promise<Task | undefined> {
        const task = await this.repository.getById(id);
        if(!task)
            return undefined;

        return {
            ...task,
            status: getTaskStatus(task, new Date()),
        };
    }

    async create(dto: CreateTaskDto): Promise<Task> {
        this.validateTarget(dto.growId, dto.growGroupId);
        const now = new Date();
        const task: Task = {
            id: createId(),
            ...dto,
            status: TaskStatus.Planned,
            recurrence: dto.recurrence ? {
                ...dto.recurrence,
                timeToReopen: dto.recurrence.timeToReopen ?? 70,
            } : undefined,
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

        this.validateTarget(dto.growId ?? existingTask.growId, dto.growGroupId ?? existingTask.growGroupId);

        const updatedTask: Task = {
            ...existingTask,
            ...dto,
            recurrence: dto.recurrence ? {
                    ...existingTask.recurrence,
                    ...dto.recurrence,
                    timeToReopen: dto.recurrence.timeToReopen ??
                        existingTask.recurrence?.timeToReopen ??
                        70,
                } : existingTask.recurrence,
            updatedAt: new Date(),
        };

        return this.repository.update(updatedTask);
    }

    async archive(id: string): Promise<Task | undefined> {
        const existingTask = await this.repository.getById(id);
        if(!existingTask || existingTask.isArchived)
            return undefined;

        const now = new Date();
        const archivedTask: Task = {
            ...existingTask,
            isArchived: true,
            archivedAt: now,
            updatedAt: now,
        };

        return this.repository.update(archivedTask);
    }

    async complete(id: string): Promise<Task | undefined> {
        const existingTask = await this.repository.getById(id);

        if(!existingTask || existingTask.completed)
            return undefined;

        const now = new Date();
        const completedTask: Task = {
            ...existingTask,
            completed: true,
            lastCompletedAt: now,
            updatedAt: now,
        };

        return this.repository.update(completedTask);
    }
    
    private validateTarget(growId?: string, growGroupId?: string): void {
        if(growId && growGroupId)
            throw new Error("A task can belong to either a grow or grow group, not both.");
        if(!growId && !growGroupId)
            throw new Error("A task must belong to either a grow or grow group.");
    }
}


export default TaskService;