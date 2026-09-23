import TaskService from "../../services/tasks";
import type { TaskRepository } from "../../services/tasks/types";
import { CreateTaskDto } from "../../types/dto/CreateTaskDto";
import { Task } from "../../types/Task";
import { TaskStatus } from "../../types/TaskStatus";
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
        status: TaskStatus.Overdue,
        completed: false,
        lastCompletedAt: undefined,
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
            update: jest.fn(),
        } as unknown as jest.Mocked<TaskRepository>;

        taskService = new TaskService(repository);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("return all tasks", async () => {
        repository.getAll.mockResolvedValue([task]);

        const result = await taskService.getAll();

        expect(result).toEqual([task]);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    it("calculates the current status for all tasks", async () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2026-09-18T10:00:00"));

        const taskWrongStatus: Task = {
            ...task,
            dueDate: new Date("2026-09-20T10:00:00"),
            leadTimeDays: 3,
            status: TaskStatus.Planned,
        };
        repository.getAll.mockResolvedValue([taskWrongStatus]);

        const result = await taskService.getAll();

        expect(result[0].status).toBe(TaskStatus.Open);
    });

    it("return a task by id", async () => {
        repository.getById.mockResolvedValue(task);

        const result = await taskService.getById("task-001");

        expect(result).toEqual(task);
        expect(repository.getById).toHaveBeenCalledWith("task-001");
    });

    it("calculates the current status for a task by id", async () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2026-09-15T10:00:00"));

        const taskWrongStatus: Task = {
            ...task,
            dueDate: new Date("2026-09-17T10:00:00"),
            leadTimeDays: 3,
            status: TaskStatus.Planned,
        };
        repository.getById.mockResolvedValue(taskWrongStatus);

        const result = await taskService.getById(task.id);

        expect(result?.status).toBe(TaskStatus.Open);
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

    it("throws when a task has both a grow and a grow group", async () => {
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

    it("sets timeToOpen to 70 for recurring tasks by default", async () => {
        repository.create.mockImplementation( async (task) => task);
        const dto: CreateTaskDto = {
            growId: task.growId,
            title: task.title,
            dueDate: task.dueDate,
            urgency: TaskUrgency.Low,
            recurrence: {
                interval: 4,
                unit: "day",
            },
        };

        const result = await taskService.create(dto);

        expect(result.recurrence?.timeToReopen).toBe(70);
    });

    it("keeps a custom timeToReopen value", async () => {
        repository.create.mockImplementation( async (task) => task);
        const dto: CreateTaskDto = {
            growId: task.growId,
            title: task.title,
            dueDate: task.dueDate,
            urgency: TaskUrgency.Alert,
            recurrence: {
                interval: 3,
                unit: "day",
                timeToReopen: 80,
            },
        };

        const result = await taskService.create(dto);

        expect(result.recurrence?.timeToReopen).toBe(80);
    });

    it("does not add recurrence to non-recurring task", async () => {
        repository.create.mockImplementation( async (task) => task);
        const dto: CreateTaskDto = {
            growId: task.growId,
            title: task.title,
            dueDate: task.dueDate,
            urgency: TaskUrgency.Medium,
        };

        const result = await taskService.create(dto);

        expect(result.recurrence).toBeUndefined();
    });

    it("updates a task", async () => {
        repository.getById.mockResolvedValue(task);
        repository.update.mockImplementation(async (updatedTask) => updatedTask);

        const result = await taskService.update("task-001", {
            ...task,
            title: "Düngen",
            completed: true,
        });

        expect(result).toBeDefined();
        expect(result?.id).toBe(task.id);
        expect(result?.createdAt).toEqual(task.createdAt);
        expect(result?.title).toBe("Düngen");
        expect(result?.completed).toBe(true);
        expect(result?.updatedAt).toBeInstanceOf(Date);
        expect(result?.updatedAt).not.toEqual(task.updatedAt);
        expect(repository.getById).toHaveBeenCalledWith("task-001");
        expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it("keeps existing timeToReopen when updating recurrence without specifying", async () => {
        const existingTask: Task = {
            ...task,
            recurrence: {
                interval: 2,
                unit: "day",
                timeToReopen: 70,
            },
        };
        repository.getById.mockResolvedValue(existingTask);

        await taskService.update("task-001", {
            recurrence: {
                interval: 3,
                unit: "day",
            },
        });

        expect(repository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                recurrence: {
                    interval: 3,
                    unit: "day",
                    timeToReopen: 70,
                },
            })
        );
    });

    it("updates timeToReopen when a new value is provided", async () => {
        const existingTask: Task = {
            ...task,
            recurrence: {
                interval: 2,
                unit: "day",
                timeToReopen: 70,
            }
        };
        repository.getById.mockResolvedValue(existingTask);

        await taskService.update("task-001", {
            recurrence: {
                interval: 3,
                unit: "day",
                timeToReopen: 80,
            }
        });

        expect(repository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                recurrence: {
                    interval: 3,
                    unit: "day",
                    timeToReopen: 80,
                },
            })
        );
    });

    it("returns undefined when updating a non-existing task", async () => {
        repository.getById.mockResolvedValue(undefined);

        const result = await taskService.update("does-not-exist", {title: "Düngen"});

        expect(result).toBeUndefined();
        expect(repository.getById).toHaveBeenCalledWith("does-not-exist");
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("archives an existing active task", async () => {
        repository.getById.mockResolvedValue(task);
        repository.update.mockImplementation(async (updatedTask) => updatedTask);

        const result = await taskService.archive("task-001");

        expect(result).toBeDefined();
        expect(result?.id).toBe(task.id);
        expect(result?.isArchived).toBe(true);
        expect(result?.archivedAt).toBeInstanceOf(Date);
        expect(result?.updatedAt).toBeInstanceOf(Date);
        expect(result?.updatedAt).not.toEqual(task.updatedAt);
        expect(repository.getById).toHaveBeenCalledWith("task-001");
        expect(repository.update).toHaveBeenCalledTimes(1);
        expect(repository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: task.id,
                isArchived: true,
                archivedAt: expect.any(Date),
            })
        );
    });

    it("returns undefined when archiving a non-existing task", async () => {
        repository.getById.mockResolvedValue(undefined);

        const result = await taskService.archive("does-not-exist");
        
        expect(result).toBeUndefined();
        expect(repository.getById).toHaveBeenCalledWith("does-not-exist");
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("returns undefined when the task is already archived", async () => {
        const archivedTask: Task = {
            ...task,
            isArchived: true,
            archivedAt: new Date("2026-09-03"),
        };

        repository.getById.mockResolvedValue(archivedTask);

        const result = await taskService.archive("task-001");

        expect(result).toBeUndefined();
        expect(repository.getById).toHaveBeenCalledWith("task-001");
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("completes an open task", async () => {
        repository.getById.mockResolvedValue(task);
        repository.update.mockImplementation(async (completedTask) => completedTask);

        const result = await taskService.complete(task.id);

        expect(result).toBeDefined();
        expect(result?.completed).toBe(true);
        expect(result?.lastCompletedAt).toBeInstanceOf(Date);
        expect(result?.updatedAt).not.toEqual(task.updatedAt);
        expect(repository.update).toHaveBeenCalledTimes(1);
        expect(repository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                id: task.id,
                completed: true,
                lastCompletedAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
    });

    it("sets the next due date when completing a recurring task", async () => {
        const existingTask: Task = {
            ...task,
            dueDate: new Date("2026-09-05"),
            recurrence: {
                interval: 3,
                unit: "day",
                timeToReopen: 70,
            },
        };
        repository.getById.mockResolvedValue(existingTask);

        jest.useFakeTimers();
        jest.setSystemTime(new Date("2026-09-07T10:00:00"));

        await taskService.complete("task-001");

            expect(repository.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    completed: true,
                    dueDate: new Date("2026-09-10T10:00:00"),
                    lastCompletedAt: new Date("2026-09-07T10:00:00"),
            })
        );
    });

    it("keeps the due date when completing a non-recurring task", async () => {
        const existingTask: Task ={
            ...task,
            recurrence: undefined,
            dueDate: new Date("2026-09-05"),
        };
        repository.getById.mockResolvedValue(existingTask);

        jest.useFakeTimers();
        jest.setSystemTime(new Date("2026-09-07T10:00:00"));

        await taskService.complete("task-001");

        expect(repository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                completed: true,
                dueDate: new Date("2026-09-05"),
                lastCompletedAt: new Date("2026-09-07T10:00:00"),
            })
        );
    });

    it("returns undefined when completing a non-existing task", async () => {
        repository.getById.mockResolvedValue(undefined);

        const result = await taskService.complete("does-not-exist");

        expect(result).toBeUndefined();
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("returns undefined when the task is already completed", async () => {
        const completedAt = new Date("2026-09-10T10:00:00.000Z");
        const completedTask: Task = {
            ...task,
            completed: true,
            lastCompletedAt: completedAt,
        };

        repository.getById.mockResolvedValue(completedTask);

        const result = await taskService.complete(task.id);

        expect(result).toBeUndefined();
        expect(repository.update).not.toHaveBeenCalled();
    });
});