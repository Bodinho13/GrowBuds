import { fireEvent, render, screen } from "@testing-library/react-native";
import GrowCard from "../../components/GrowCard";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";
import { Grow } from "../../types/Grow";

const mockGrow: Grow = {
    id: "grow-001",
    plantId: "plant-001",
    name: "Sommer Grow",
    startDate: new Date("2026-08-01"),
    amount: 4,
    stage: GrowStage.Vegetative,
    medium: GrowMedium.Soil,
    location: "Growbox",
    weight: 120,
    createdAt: new Date("2026-08-02"),
    updatedAt: new Date("2026-08-19"),
    isArchived: false,
};

describe("GrowCard", () => {
    it("shows the grow information", () => {
        const onPress = jest.fn();

        render(
            <GrowCard
                grow={mockGrow}
                plantName="Northern Lights"
                onPress={onPress}
            />
        );

        expect(screen.getByText("Sommer Grow")).toBeTruthy();
        expect(screen.getByText("Northern Lights")).toBeTruthy();
        expect(screen.getByText("Menge: 4")).toBeTruthy();
        expect(screen.getByText("Phase: Vegetative Phase")).toBeTruthy();
    });

    it("does not show the plant name when it is missing", () => {
        const onPress = jest.fn();

        render(
            <GrowCard
                grow={mockGrow}
                onPress={onPress}
            />
        );

        expect(screen.queryByText("Northern Lights")).toBeNull();
    });

    it("shows the archived badge for an archived grow", () => {
        const onPress = jest.fn();

        render(
            <GrowCard
                grow={{
                    ...mockGrow,
                    isArchived: true,
                }}
                plantName="Northern Lights"
                onPress={onPress}
            />
        );

        expect(screen.getByText("Archiviert")).toBeTruthy();
    });

    it("does not show the archived badge for an active grow", () => {
        const onPress = jest.fn();

        render(
            <GrowCard
                grow={mockGrow}
                plantName="Northern Lights"
                onPress={onPress}
            />
        );

        expect(screen.queryByText("Archiviert")).toBeNull();
    });

    it("calls onPress when the card is pressed", () => {
        const onPress = jest.fn();

        render(
            <GrowCard
                grow={mockGrow}
                plantName="Northern Lights"
                onPress={onPress}
            />
        );

        fireEvent.press(screen.getByText("Sommer Grow"));

        expect(onPress).toHaveBeenCalledTimes(1);
    });
});