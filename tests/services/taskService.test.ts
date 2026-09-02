import { SQLiteStorage } from "../../services/storage/sqliteStorage";
import TaskService from "../../services/tasks";
import type { TaskRepository } from "../../services/tasks/types";
import { Task } from "../../types/Task";
import { TaskUrgency } from "../../types/TaskUrgency";

describe("TaskService", () => {
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

    it("return all tasks", async () => {
        const repository: TaskRepository = {
            getAll: jest.fn().mockResolvedValue([task]),
            getById: jest.fn(),
        };
        const service = new TaskService(repository);

        const result = await service.getAll();

        expect(result).toEqual([task]);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    it("return a task by id", async () => {
        const repository: TaskRepository = {
            getAll: jest.fn(),
            getById: jest.fn().mockResolvedValue(task),
        };
        const service = new TaskService(repository);

        const result = await service.getById("task-001");

        expect(result).toEqual(task);
        expect(repository.getById).toHaveBeenCalledWith("task-001");
    });

    it("returns undefined when a task does not exist", async () => {
        const repository: TaskRepository = {
            getAll: jest.fn(),
            getById: jest.fn().mockResolvedValue(undefined),
        };
        const service = new TaskService(repository);

        const result = await service.getById("does-not-exist");
        
        expect(result).toBeUndefined();
        expect(repository.getById).toHaveBeenCalledWith("does-not-exist");
    });
});