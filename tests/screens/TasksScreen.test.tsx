import { render, screen, waitFor } from "@testing-library/react-native";
import { useTasks } from "../../hooks/useTasks";
import TasksScreen from "../../screens/TasksScreen";
import { useServices } from "../../services/ServicesContext";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";
import { TaskUrgency } from "../../types/TaskUrgency";

jest.mock("../../hooks/useTasks");
jest.mock("../../services/ServicesContext");

jest.mock("@react-navigation/native", () => ({
    useFocusEffect: jest.fn(),
}));

const mockRefresh = jest.fn();
const mockGetAll = jest.fn();

const tasks = [
    {
        id: "task-001",
        growId: "grow-001",
        title: "Gießen",
        dueDate: new Date("2026-09-05"),
        urgency: TaskUrgency.Medium,
        completed: false,
        createdAt: new Date("2026-09-01"),
        updatedAt: new Date("2026-09-03"),
        isArchived: false,
    },
];

const grows = [
    {
        id: "grow-001",
        plantId: "plant-001",
        name: "Sommer",
        startDate: new Date("2026-08-01"),
        amount: 2,
        stage: GrowStage.Vegetative,
        medium: GrowMedium.Soil,
        createdAt: new Date("2026-08-01"),
        updatedAt: new Date("2026-08-15"),
        isArchived: false,
    },
];

describe("TasksScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useTasks as jest.Mock).mockReturnValue({
            tasks,
            loading: false,
            refresh: mockRefresh,
        });

        (useServices as jest.Mock).mockReturnValue({
            growService: {
                getAll: mockGetAll,
            },
        });

        mockGetAll.mockResolvedValue(grows);
    });

    it("displays tasks", async () => {
        render(
            <TasksScreen navigation={{} as any} route={{} as any}/>
        );

        await waitFor(() => {
            expect(screen.getByText("Gießen")).toBeTruthy();
            expect(screen.getByText("Sommer")).toBeTruthy();
        });
    });

    it("displays the empty state when there are no tasks", () => {
        (useTasks as jest.Mock).mockReturnValue({
            tasks: [],
            loading: false,
            refresh: mockRefresh,
        });

        render(
            <TasksScreen navigation={{} as any} route={{} as any}/>
        );

        expect(screen.getByText("Keine Aufgaben vorhanden.")).toBeTruthy();
    });

    it("displays loading state", () => {
        (useTasks as jest.Mock).mockReturnValue({
            tasks: [],
            loading: true,
            refresh: mockRefresh,
        });

        render(
            <TasksScreen navigation={{} as any} route={{} as any} />
        );

        expect(screen.queryByText("Meine Aufgaben")).toBeNull();
    });

    it("loads grow names", async () => {
        render(
            <TasksScreen navigation={{} as any} route={{} as any}/>
        );

        await waitFor(() => {
            expect(mockGetAll).toHaveBeenCalledTimes(1);
        });
    });
});