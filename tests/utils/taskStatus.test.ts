import { Task } from "../../types/Task";
import { TaskStatus } from "../../types/TaskStatus";
import { TaskUrgency } from "../../types/TaskUrgency";
import { getTaskStatus } from "../../utils/taskStatus";

const baseTask: Task = {
    id: "task-001",
    growId: "grow-001",
    title: "Test",
    dueDate: new Date("2026-09-20T10:00:00"),
    urgency: TaskUrgency.Medium,
    status: TaskStatus.Planned,
    completed: false,
    createdAt: new Date("2026-09-01T10:00:00"),
    updatedAt: new Date("2026-09-01T10:00:00"),
    isArchived: false,
};

describe("getTaskStatus", () => {
    it("returns Planned before the lead time", () => {
        const task: Task = {
            ...baseTask,
            leadTimeDays: 3,
        };

        const result = getTaskStatus(task, new Date("2026-09-16T10:00:00"));

        expect(result).toBe(TaskStatus.Planned);
    });

    it("returns Open during the lead time", () => {
        const task: Task = {
            ...baseTask,
            leadTimeDays: 3,
        };

        const result = getTaskStatus(task, new Date("2026-09-18T10:00:00"));
        
        expect(result).toBe(TaskStatus.Open);
    });

    it("returns Overdue after the due date", () => {
        const result = getTaskStatus(baseTask, new Date("2026-09-21T10:00:00"));

        expect(result).toBe(TaskStatus.Overdue);
    });

    it("returns Planned before the reopen threshold", () => {
        const task: Task = {
            ...baseTask,
            dueDate: new Date("2026-09-11T10:00:00"),
            lastCompletedAt: new Date("2026-09-01T10:00:00"),
            recurrence: {
                interval: 10,
                unit: "day",
                timeToReopen: 70,
            },
        };

        const result = getTaskStatus(task, new Date("2026-09-07T10:00:00"));

        expect(result).toBe(TaskStatus.Planned);
    });

    it("returns Open after the reopen threshold", () => {
        const task: Task = {
            ...baseTask,
            dueDate: new Date("2026-09-11T10:00:00"),
            lastCompletedAt: new Date("2026-09-01T10:00:00"),
            recurrence: {
                interval: 10,
                unit: "day",
                timeToReopen: 70,
            },
        };

        const result = getTaskStatus(task, new Date("2026-09-08T10:00:00"));

        expect(result).toBe(TaskStatus.Open);
    });

    it("returns Open exactly at the reopen threshold", () => {
        const task: Task = {
            ...baseTask,
            dueDate: new Date("2026-09-11T10:00:00"),
            lastCompletedAt: new Date("2026-09-01T10:00:00"),
            recurrence: {
                interval: 10,
                unit: "day",
                timeToReopen: 70,
            },
        };

        const resultPlanned = getTaskStatus(task, new Date("2026-09-08T09:59:59"));
        const resultOpen = getTaskStatus(task, new Date("2026-09-08T10:00:00"));

        expect(resultPlanned).toBe(TaskStatus.Planned);
        expect(resultOpen).toBe(TaskStatus.Open);
    });

    it("uses 70 percent as the default reopen threshold", () => {
        const task: Task = {
            ...baseTask,
            dueDate: new Date("2026-09-11T10:00:00"),
            lastCompletedAt: new Date("2026-09-01T10:00:00"),
            recurrence: {
                interval: 10,
                unit: "day",
            },
        };

        const result = getTaskStatus(task, new Date("2026-09-08T10:00:00"));

        expect(result).toBe(TaskStatus.Open);
    });

    it("handles weekly recurrence correctly", () => {
        const task: Task = {
            ...baseTask,
            dueDate: new Date("2026-09-15T10:00:00"),
            lastCompletedAt: new Date("2026-09-01T10:00:00"),
            recurrence: {
                interval: 2,
                unit: "week",
                timeToReopen: 70,
            },
        };

        const result = getTaskStatus(task, new Date("2026-09-10T10:00:00"));

        expect(result).toBe(TaskStatus.Planned);
    });

    it("respects a custom timeToReopen value", () => {
        const task: Task = {
            ...baseTask,
            dueDate: new Date("2026-09-11T10:00:00"),
            lastCompletedAt: new Date("2026-09-01T10:00:00"),
            recurrence: {
                interval: 10,
                unit: "day",
                timeToReopen: 90,
            },
        };

        const result = getTaskStatus(task, new Date("2026-09-09T10:00:00"));

        expect(result).toBe(TaskStatus.Planned);
    });
});