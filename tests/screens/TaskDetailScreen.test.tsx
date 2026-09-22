import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useTask } from "../../hooks/useTask";
import TaskDetailScreen from "../../screens/TaskDetailScreen";
import { useServices } from "../../services/ServicesContext";
import { Task } from "../../types/Task";
import { TaskUrgency } from "../../types/TaskUrgency";
import { TaskStatus } from "../../types/TaskStatus";

jest.mock("../../hooks/useTask");
jest.mock("../../services/ServicesContext");

const mockedUseTask = jest.mocked(useTask);
const mockedUseServices = jest.mocked(useServices);

const task: Task = {
    id: "task-001",
    growId: "grow-001",
    title: "Gießen",
    dueDate: new Date("2026-09-15"),
    urgency: TaskUrgency.Medium,
    status: TaskStatus.Open,
    completed: false,
    leadTimeDays: 2,
    createdAt: new Date("2026-09-01"),
    updatedAt: new Date("2026-09-01"),
    isArchived: false,
};

function renderTaskDetailScreen(taskId: string) {
    return render(
        <TaskDetailScreen
            route={{params: {taskId}} as any}
            navigation={{} as any}
        />
    )
}

describe("TaskDetailScreen", () => {
    const completeMock = jest.fn();
    const refreshMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseServices.mockReturnValue({
            taskService: {
                complete: completeMock,
            },
        } as any);
    });

    it("displays the loading state", () => {
        mockedUseTask.mockReturnValue({
            task: null,
            loading: true,
            refresh: jest.fn(),
        });

        renderTaskDetailScreen("task-001");

        expect(screen.queryByText("Aufgabe nicht gefunden.")).toBeNull();
    });

    it("displays a not-found message", async () => {
        mockedUseTask.mockReturnValue({
            task: null,
            loading: false,
            refresh: jest.fn(),
        });

        renderTaskDetailScreen("missing-task");

        expect(screen.getByText("Aufgabe nicht gefunden.")).toBeTruthy();
    });

    it("displays the task details", async () => {
        mockedUseTask.mockReturnValue({
            task,
            loading: false,
            refresh: jest.fn(),
        });

        renderTaskDetailScreen(task.id);

        expect(screen.getByText("Gießen")).toBeTruthy();
        expect(screen.getByText("Offen"));
        expect(screen.getByText(task.dueDate.toLocaleDateString("DE-de"))).toBeTruthy();
        expect(screen.getByText("Erledigen")).toBeTruthy();
    });

    it("completes an open task", async () => {
        mockedUseTask.mockReturnValue({
            task,
            loading: false,
            refresh: refreshMock,
        });

        completeMock.mockResolvedValue({
            ...task,
            completed: true,
            lastCompletedAt: new Date(),
        });

        renderTaskDetailScreen(task.id);

        fireEvent.press(screen.getByText("Erledigen"));
        await waitFor(() => {
            expect(completeMock).toHaveBeenCalledWith(task.id);
        });

        expect(refreshMock).toHaveBeenCalledTimes(1);
    });
});