import { SQLiteStorage } from "../../services/storage/sqliteStorage";
import TaskService from "../../services/tasks";
import type { TaskRepository } from "../../services/tasks/types";
import { CreateTaskDto } from "../../types/dto/CreateTaskDto";
import { Task } from "../../types/Task";
import { TaskUrgency } from "../../types/TaskUrgency";

describe("TaskService", () => {
    let repository: jest.Mocked<TaskRepository>;
    let taskService: TaskService;

    const task: Task = {
        id: "task-001",
        growId: "grow-001",
        title: "Gießen",
        dueDate: new Date("2026-09-03"),
        urgency: TaskUrgency.Medium,
        completed: false,
        createdAt: new Date("2026-09-01"),
        updatedAt: new Date("2026-09-01"),
        isArchived: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        repository = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
        };

        taskService = new TaskService(repository);
    });

    it("return all tasks", async () => {
        repository.getAll.mockResolvedValue([task]);

        const result = await taskService.getAll();

        expect(result).toEqual([task]);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    it("return a task by id", async () => {
        repository.getById.mockResolvedValue(task);

        const result = await taskService.getById("task-001");

        expect(result).toEqual(task);
        expect(repository.getById).toHaveBeenCalledWith("task-001");
    });

    it("returns undefined when a task does not exist", async () => {
        repository.getById.mockResolvedValue(undefined);

        const result = await taskService.getById("does-not-exist");
        
        expect(result).toBeUndefined();
        expect(repository.getById).toHaveBeenCalledWith("does-not-exist");
    });

    it("creates a task for a grow", async () => {
        repository.create.mockImplementation(async (task) => task);

        const dto: CreateTaskDto = {
            growId: "grow-001",
            title: "Gießen",
            dueDate: new Date("2026-09-13"),
            urgency: TaskUrgency.Low,
        };
        const result = await taskService.create(dto);

        expect(result).toMatchObject({
            growId: "grow-001",
            title: "Gießen",
            dueDate: new Date("2026-09-13"),
            urgency: TaskUrgency.Low,
            completed: false,
            isArchived: false,
        });
        expect(result.id).toBeDefined();
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(result);
    });

    it("creates a task for a grow group", async () => {
        repository.create.mockImplementation(async (task) => task);

        const dto: CreateTaskDto = {
            growGroupId: "group-001",
            title: "Düngen",
            dueDate: new Date("2026-09-05"),
            urgency: TaskUrgency.High,
        };

        const result = await taskService.create(dto);

        expect(result).toMatchObject({
            growGroupId: "group-001",
            title: "Düngen",
            dueDate: new Date("2026-09-05"),
            urgency: TaskUrgency.High,
            completed: false,
            isArchived: false,
        });
        expect(result.id).toBeDefined();
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(result);
    });

    it("throws when a taks has both a grow and a grow group", async () => {
        const dto: CreateTaskDto = {
            growId: "grow-001",
            growGroupId: "group-001",
            title: "Gießen",
            dueDate: new Date("2026-09-03"),
            urgency: TaskUrgency.Medium,
        };

        await expect(taskService.create(dto)).rejects.toThrow(
            "A task can belong to either a grow or grow group, not both."
        );
        expect(repository.create).not.toHaveBeenCalled();
    });

    it("throws when a task has neither a grow or a grow group", async () => {
        const dto: CreateTaskDto = {
            title: "Gießen",
            dueDate: new Date("2026-09-03"),
            urgency: TaskUrgency.Medium,
        };

        await expect(taskService.create(dto)).rejects.toThrow(
            "A task must belong to either a grow or grow group."
        );
        expect(repository.create).not.toHaveBeenCalled();
    });
});