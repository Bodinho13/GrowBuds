import { SQLiteStorage } from "../../services/storage/sqliteStorage";
import { TaskRepository } from "../../services/tasks/taskRepository";
import { createTaskSql, getAllTasksSql, getTaskByIdSql, updateTaskSql } from "../../services/tasks/taskSql";
import { TaskRow } from "../../services/tasks/types";
import { Task } from "../../types/Task";
import { TaskUrgency } from "../../types/TaskUrgency";

describe("TaskRepository", () => {
    let repository: TaskRepository;
    let storage: jest.Mocked<SQLiteStorage>;

    const task: Task = {
        id: "task-001",
        growId: "grow-001",
        title: "Gießen",
        dueDate: new Date("2026-09-03"),
        urgency: TaskUrgency.Medium,
        completed: false,
        recurrence: {
            interval: 2,
            unit: "day"
        },
        createdAt: new Date("2026-09-01"),
        updatedAt: new Date("2026-09-02"),
        isArchived: false,
    };

    const taskRow: TaskRow = {
        id: "task-001",
        growId: "grow-001",
        growGroupId: null,
        title: "Gießen",
        dueDate: "2026-09-03T00:00:00.000Z",
        urgency: TaskUrgency.Medium,
        completed: 0,
        recurrenceInterval: 2,
        recurrenceUnit: "day",
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-02T00:00:00.000Z",
        archivedAt: null,
        isArchived: 0,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        storage = {
            getAll: jest.fn(),
            getFirst: jest.fn(),
            execute: jest.fn(),
        } as unknown as jest.Mocked<SQLiteStorage>;

        repository = new TaskRepository(storage);
    })

    it("returns all tasks", async () => {
        storage.getAll.mockResolvedValue([taskRow]);

        const result = await repository.getAll();

        expect(result).toEqual([task]);
        expect(storage.getAll).toHaveBeenCalledWith(getAllTasksSql);
    });

    it("returns a task by id", async () => {
        storage.getFirst.mockResolvedValue(taskRow);

        const result = await repository.getById("task-001");

        expect(result).toEqual(task);
        expect(storage.getFirst).toHaveBeenCalledWith(getTaskByIdSql, ["task-001"]);
    });

    it("returns undefined when a task does not exist", async () => {
        storage.getFirst.mockResolvedValue(undefined);

        const result = await repository.getById("does-not-exist");

        expect(result).toBeUndefined();
        expect(storage.getFirst).toHaveBeenCalledWith(getTaskByIdSql, ["does-not-exist"]);
    });

    it("creates a task", async () => {
        const result = await repository.create(task);

        expect(storage.execute).toHaveBeenCalledWith(
            createTaskSql,
            [
                task.id,
                task.growId ?? null,
                task.growGroupId ?? null,
                task.title,
                task.dueDate.toISOString(),
                task.urgency,
                task.completed ? 1 : 0,
                task.recurrence?.interval ?? null,
                task.recurrence?.unit ?? null,
                task.createdAt.toISOString(),
                task.updatedAt.toISOString(),
                task.archivedAt?.toISOString() ?? null,
                task.isArchived ? 1 : 0,
            ]
        );
        expect(result).toEqual(task);
    });

    it("updates a task", async () => {
        const updatedTask: Task = {
            ...task,
            title: "Düngen",
            completed: true,
            updatedAt: new Date("2026-09-04"),
        };
        const result = await repository.update(updatedTask);

        expect(storage.execute).toHaveBeenCalledWith(updateTaskSql, [
            updatedTask.growId ?? null,
            updatedTask.growGroupId ?? null,
            updatedTask.title,
            updatedTask.dueDate.toISOString(),
            updatedTask.urgency,
            updatedTask.completed ? 1 : 0,
            updatedTask.recurrence?.interval ?? null,
            updatedTask.recurrence?.unit ?? null,
            updatedTask.updatedAt.toISOString(),
            updatedTask.archivedAt?.toISOString() ?? null,
            updatedTask.isArchived ? 1 : 0,
            updatedTask.id,
        ]);

        expect(result).toEqual(updatedTask);
    });
});