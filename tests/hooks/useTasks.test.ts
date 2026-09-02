import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useServices } from "../../services/ServicesContext";
import { TaskUrgency } from "../../types/TaskUrgency";
import { useTasks } from "../../hooks/useTasks";

jest.mock("../../services/ServicesContext");

const mockGetAll = jest.fn();

const tasks = [
    {
        id: "task-001",
        growId: "grow-001",
        title: "Gießen",
        dueDate: new Date("2026-09-03"),
        urgency: TaskUrgency.Medium,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
    },
];

describe("useTasks", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useServices as jest.Mock).mockReturnValue({
            taskService: {
                getAll: mockGetAll,
            },
        });
    });

    it("loads tasks", async () => {
        mockGetAll.mockResolvedValue(tasks);

        const { result } = renderHook(() => useTasks());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.tasks).toEqual(tasks);
        expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    it("refreshes tasks", async () => {
        mockGetAll.mockResolvedValue(tasks);

        const { result } = renderHook(() => useTasks());

        await waitFor(() => {
            expect(mockGetAll).toHaveBeenCalledTimes(1);
        });

        await act(async () => {
            await result.current.refresh();
        });
        expect(mockGetAll).toHaveBeenCalledTimes(2);
        expect(result.current.tasks).toEqual(tasks);
    });
});