import { fireEvent, render, screen } from "@testing-library/react-native";
import TaskCard from "../../components/TaskCard";
import { TaskUrgency } from "../../types/TaskUrgency";
import { TaskStatus } from "../../types/TaskStatus";

const task = {
    id: "task-001",
    growId: "grow-001",
    title: "Gießen",
    dueDate: new Date("2026-09-05"),
    urgency: TaskUrgency.Medium,
    status: TaskStatus.Planned,
    completed: false,
    createdAt: new Date("2026-09-01"),
    updatedAt: new Date("2026-09-01"),
    isArchived: false,
};

function renderTaskCard () {
    return render(
        <TaskCard
            task={task}
            growName="Mein erster Grow"
        />
    );
}

describe("TaskCard", () => {
    it("displays the task title", () => {
        renderTaskCard();

        expect(screen.getByText("Gießen")).toBeTruthy();
    });

    it("displays the grow name", () => {
        renderTaskCard();

        expect(screen.getByText("Mein erster Grow")).toBeTruthy();
    });

    it("displays the urgency", () => {
        renderTaskCard();

        expect(screen.getByText("Fällig: 5.9.2026")).toBeTruthy();
    });

    it("displays the urgency", () => {
        renderTaskCard();

        expect(screen.getByText("Dringlichkeit: medium")).toBeTruthy();
    });

    it("opens the action menu when pressed", () => {
        render(<TaskCard
                task={task}
                growName="Mein erster Grow"
            />
        );

        expect(screen.queryByText("Bearbeiten")).toBeNull();

        fireEvent.press(screen.getByText("Gießen"));

        expect(screen.getByText("Bearbeiten")).toBeTruthy();
        expect(screen.getByText("Info")).toBeTruthy();
        expect(screen.getByText("Abschließen")).toBeTruthy();
    });

    it("displays a completed task with completed styling", () => {
        const completedTask = {
            ...task,
            completed: true,
        };

        render(
            <TaskCard
                task={completedTask}
                growName="Mein erster Grow"
            />
        );
        const title = screen.getByText("Gießen");

        expect(title.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    textDecorationLine: "line-through",
                }),
            ])
        );
    });
});