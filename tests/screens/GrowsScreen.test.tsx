import { NavigationContainer } from "@react-navigation/native";
import { useGrows } from "../../hooks/useGrows";
import { useServices } from "../../services/ServicesContext";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import GrowsScreen from "../../screens/GrowsScreen";

jest.mock("../../hooks/useGrows");
jest.mock("../../services/ServicesContext");

const mockedUseGrows = jest.mocked(useGrows);
const mockedUseServices = jest.mocked(useServices);
const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
} as any;
const mockRoute = {
    key: "GrowsList",
    name: "GrowsList",
} as any;
const activeGrow = {
    id: "grow-001",
    name: "Sommer Grow",
    plantId: "plant-001",
    startDate: new Date("2026-08-01"),
    amount: 4,
    stage: GrowStage.Vegetative,
    medium: GrowMedium.Soil,
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-19"),
    isArchived: false,
};
const archivedGrow = {
    id: "grow-002",
    name: "Alter Grow",
    plantId: "plant-002",
    startDate: new Date("2026-08-01"),
    amount: 2,
    stage: GrowStage.Harvest,
    medium: GrowMedium.Soil,
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-24"),
    isArchived: true,
};
const plants = [{
    id: "plant-001",
    name: "Northern Lights",
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2025-08-19"),
    isArchived: false,
}, {
    id: "plant-002",
    name: "Blue Dream",
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-19"),
    isArchived: false,
},];

function renderGrowsScreen() {
    return render(
        <NavigationContainer>
            <GrowsScreen
                navigation={mockNavigation}
                route={mockRoute}
            />
        </NavigationContainer>,
    );
}

describe("GrowsScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseServices.mockReturnValue({
            plantService: {
                getAll: jest.fn().mockResolvedValue(plants),
            },
        } as any);

        mockedUseGrows.mockReturnValue({
            grows: [],
            loading: false,
            refresh: jest.fn(),
        });
    });

    it("shows the loading view while grows are loading", async () => {
        mockedUseGrows.mockReturnValue({
            grows: [],
            loading: true,
            refresh: jest.fn(),
        });

        renderGrowsScreen();

        await waitFor(() => {
            expect(screen.queryByText("Aktive Grows")).toBeNull();
            expect(screen.queryByText("+ Neuer Grow")).toBeNull();
        });
    });

    it("shows active and archived grows in separate sections", async () => {
        mockedUseGrows.mockReturnValue({
            grows:[activeGrow, archivedGrow],
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowsScreen();

        await waitFor(() => {
            expect(screen.getByText("Aktive Grows")).toBeTruthy();
            expect(screen.getByText("Archivierte Grows")).toBeTruthy();
            expect(screen.getByText("Sommer Grow")).toBeTruthy();
            expect(screen.getByText("Alter Grow")).toBeTruthy();
            expect(screen.getByText("Archiviert")).toBeTruthy();
        });
    });

    it("shows the plant name for each grow", async () => {
        mockedUseGrows.mockReturnValue({
            grows: [activeGrow, archivedGrow],
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowsScreen();
        
        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
            expect(screen.getByText("Blue Dream")).toBeTruthy();
        });
    });

    it("shows amount and stage for each grow", async () => {
        mockedUseGrows.mockReturnValue({
            grows: [activeGrow],
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowsScreen();

        expect(screen.getByText("Menge: 4")).toBeTruthy();
        expect(screen.getByText("Phase: Vegetative Phase")).toBeTruthy();
    });

    it("shows empty messages for empty sections", () => {
        mockedUseGrows.mockReturnValue({
            grows: [],
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowsScreen();

        expect(screen.getByText("Keine Aktive Grows vorhanden.")).toBeTruthy();
        expect(screen.getByText("Keine Archivierte Grows vorhanden.")).toBeTruthy();
    });

    it("navigates to the grow detail screen when a grow is pressed", async () => {
        mockedUseGrows.mockReturnValue({
            grows: [activeGrow],
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowsScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Sommer Grow"));

        expect(mockNavigation.navigate).toHaveBeenCalledWith(
            "GrowDetail",
            {
                growId: "grow-001",
                plantName: "Northern Lights",
            },
        );
    });

    it("navigates to create grow when the create button is pressed", () => {
        renderGrowsScreen();

        fireEvent.press(screen.getByText("+ Neuer Grow"));

        expect(mockNavigation.navigate).toHaveBeenCalledWith("CreateGrow",);
    });

    it("refreshes the grows when the screen gets focused", async () => {
        const refresh = jest.fn();
        mockedUseGrows.mockReturnValue({
            grows: [],
            loading: false,
            refresh,
        });
        renderGrowsScreen();

        await waitFor(() => {
            expect(refresh).toHaveBeenCalled();
        });
    });
});