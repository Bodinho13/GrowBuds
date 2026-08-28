import { fireEvent, render, screen } from "@testing-library/react-native";
import { Plant } from "../../types/Plant";
import PlantCard from "../../components/PlantCard";

const mockPlant: Plant = {
    id: "plant-001",
    name: "Northern Lights",
    strain: "Indica",
    breeder: "Tester",
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-02"),
    isArchived: false,
};

describe("PlantCard", () => {
    it("shows the plant name", () => {
        render(<PlantCard plant={mockPlant}/>);
        
        expect(screen.getByText("Northern Lights")).toBeTruthy();
    });

    it("shows the strain when available", () => {
        render(<PlantCard plant={mockPlant}/>)

        expect(screen.getByText("Indica")).toBeTruthy();
    });

    it("shows the breeder when available", () => {
        render(<PlantCard plant={mockPlant}/>);

        expect(screen.getByText("Tester")).toBeTruthy();
    });

    it("does not show the strain when it is missing", () => {
        render(
            <PlantCard plant={{
                    ...mockPlant,
                    strain: undefined,
                }}
            />
        );

        expect(screen.queryByText("Indica")).toBeNull();
    });

    it("does not show the breeder when it is missing", () => {
        render(
            <PlantCard plant={{
                    ...mockPlant,
                    breeder: undefined,
                }}
            />
        );

        expect(screen.queryByText("Tester")).toBeNull();
    });

    it("shows the archived badge for an archived plant", () => {
        render(
            <PlantCard plant={{
                    ...mockPlant,
                    isArchived: true,
                }}
            />
        );

        expect(screen.getByText("Archiviert")).toBeTruthy();
    });

    it("does not show the archived badge for an active plant", () => {
        render(<PlantCard plant={mockPlant}/>);

        expect(screen.queryByText("Archiviert")).toBeNull();
    });

    it("calls onPress when the card is pressed", () => {
        const onPress = jest.fn();

        render(<PlantCard plant={mockPlant} onPress={onPress}/>);

        fireEvent.press(screen.getByText("Northern Lights"));

        expect(onPress).toHaveBeenCalledTimes(1);
    })
});