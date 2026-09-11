import { act, render, renderHook, waitFor } from "@testing-library/react-native";
import { useServices } from "../../services/ServicesContext";
import { Task } from "../../types/Task";
import { TaskUrgency } from "../../types/TaskUrgency";
import { useTask } from "../../hooks/useTask";

jest.mock("../../services/ServicesContext", () => ({
    useServices: jest.fn(),
}));

const mockedUseServices = jest.mocked(useServices);

describe("useTask", () => {
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
    });

    it("loads a task on mount", async () => {
        const getById = jest.fn().mockResolvedValue(task);

        mockedUseServices.mockReturnValue({
            taskService: {
                getById,
            },
        } as any);

        const {result} = renderHook(() => useTask("task-001"));

        expect(result.current.loading).toBe(true);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.task).toEqual(task);
        expect(getById).toHaveBeenCalledWith("task-001");
        expect(getById).toHaveBeenCalledTimes(1);
    });

    it("returns undefined when the task does not exist", async () => {
        const getById = jest.fn().mockResolvedValue(undefined);

        mockedUseServices.mockReturnValue({
            taskService: {
                getById,
            }
        } as any);

        const {result} = renderHook(() => useTask("does-not-exist"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.task).toBeNull();
        expect(getById).toHaveBeenCalledWith("does-not-exist");
    });

    it("refreshes the task", async () => {
        const updatedTask: Task = {
            ...task,
            title: "Düngen",
        };

        const getById = jest.fn().mockResolvedValueOnce(task).mockResolvedValueOnce(updatedTask);
        mockedUseServices.mockReturnValue({
            taskService: {
                getById,
            },
        } as any);

        const {result} = renderHook(() => useTask("task-001"));

        await waitFor(() => {
            expect(result.current.task).toEqual(task);
        });

        await act(async () => {
            await result.current.refresh();
        });
        
        expect(result.current.task).toEqual(updatedTask);
        expect(getById).toHaveBeenCalledTimes(2);
    });
});