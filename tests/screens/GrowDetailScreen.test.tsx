import { NavigationContainer } from "@react-navigation/native";
import { useGrow } from "../../hooks/useGrow";
import { useServices } from "../../services/ServicesContext";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";
import GrowDetailScreen from "../../screens/GrowDetailScreen";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

jest.mock("../../hooks/useGrow");
jest.mock("../../services/ServicesContext");

const mockedUseGrow = jest.mocked(useGrow);
const mockedUseServices = jest.mocked(useServices);

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
} as any;

const mockRoute = {
    key: "GrowDetail",
    name: "GrowDetail",
    params: {
        growId: "grow-001",
        plantName: "Northern Lights",
    },
} as any;

const mockGrow = {
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
} as any;

function renderGrowDetailScreen() {
    return render(
        <NavigationContainer>
            <GrowDetailScreen
                navigation={mockNavigation}
                route={mockRoute}
            />
        </NavigationContainer>
    );
}

describe("GrowDetailScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseServices.mockReturnValue({
            growService: {
                archive: jest.fn(),
            },
        } as any);
    });

    it("shows the loading view while the grow is loading", () => {
        mockedUseGrow.mockReturnValue({
            grow: null,
            loading: true,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();

        expect(screen.queryByText("Sommer Grow")).toBeNull();
    });

    it("shows an empty state when the grow does not exist", () => {
        mockedUseGrow.mockReturnValue({
            grow: null,
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();

        expect(screen.getByText("Grow wurde nicht gefunden.")).toBeTruthy();
        expect(screen.queryByText("Bearbeiten")).toBeNull();
    });

    it("shows the grow details", () => {
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();

        expect(mockGrow.weight).toBe(120);
        expect(screen.getByText("Sommer Grow")).toBeTruthy();
        expect(screen.getByText("Northern Lights")).toBeTruthy();
        expect(screen.getByText("Startdatum")).toBeTruthy();
        expect(screen.getByText("1.8.2026")).toBeTruthy();
        expect(screen.getByText("Menge")).toBeTruthy();
        expect(screen.getByText("4")).toBeTruthy();
        expect(screen.getByText("Phase")).toBeTruthy();
        expect(screen.getByText("Vegetative Phase")).toBeTruthy();
        expect(screen.getByText("Medium")).toBeTruthy();
        expect(screen.getByText("Erde")).toBeTruthy();
        expect(screen.getByText("Standort")).toBeTruthy();
        expect(screen.getByText("Growbox")).toBeTruthy();
        expect(screen.getByText("Gewicht")).toBeTruthy();
        expect(screen.getByText("120")).toBeTruthy();
        expect(screen.getByText("Erstellt am")).toBeTruthy();
        expect(screen.getByText("2.8.2026")).toBeTruthy();
        expect(screen.getByText("Zuletzt geändert")).toBeTruthy();
        expect(screen.getByText("19.8.2026")).toBeTruthy();
    });

    it("Does not show optional location when it is missing", () => {
        mockedUseGrow.mockReturnValue({
            grow: {
                ...mockGrow,
                location: undefined,
            },
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();

        expect(screen.queryByText("Standort")).toBeNull();
        expect(screen.queryByText("Growbox")).toBeNull();
    });

    it("does not show optional weight when it is missing", () => {
        mockedUseGrow.mockReturnValue({
            grow: {
                ...mockGrow,
                weight: undefined,
            },
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();
        
        expect(screen.queryByText("Gewicht")).toBeNull();
        expect(screen.queryByText("120")).toBeNull();
    });

    it("shows archive information for an archived grow", () => {
        mockedUseGrow.mockReturnValue({
            grow: {
                ...mockGrow,
                isArchived: true,
                endDate: new Date("2026-08-25"),
            },
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();

        expect(screen.queryByText("Archiviert")).toBeTruthy();
        expect(screen.getByText(/Enddatum:\s25\.8\.2026/)).toBeTruthy();
        expect(screen.queryByText("Bearbeiten")).toBeTruthy();
        expect(screen.queryByText("Archivieren")).toBeNull();
    });

    it("does not show the archive information when the grow is active", () => {
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();
        
        expect(screen.queryByText("Enddatum")).toBeNull();
        expect(screen.getByText("Archivieren")).toBeTruthy();
    });

    it("naviagtes to edit grow when pressing Bearbeiten", () => {
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderGrowDetailScreen();
        fireEvent.press(screen.getByText("Bearbeiten"));

        expect(mockNavigation.navigate).toHaveBeenCalledWith(
            "EditGrow",
            {
                growId: "grow-001",
                plantName: "Northern Lights",
            },
        );
    });

    it("opens the archive confirmation alert", () => {
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        renderGrowDetailScreen();

        fireEvent.press(screen.getByText("Archivieren"));

        expect(alertSpy).toHaveBeenCalledWith(
            "Grow archivieren",
            'Möchtest du "Sommer Grow - Northern Lights" wirklich archivieren?',
            expect.any(Array),
        );

        alertSpy.mockRestore();
    });

    it("archives the grow and goes back after confirmation", async () => {
        const archive = jest.fn().mockResolvedValue({
            ...mockGrow,
            isArchived: true,
        });
        mockedUseServices.mockReturnValue({
            growService: {
                archive,
            },
        } as any);
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        let alertButtons: any[] = [];
        const alertSpy = jest.spyOn(Alert, "alert")
            .mockImplementation((_title, _message, buttons) => {
                alertButtons = buttons ?? [];
            });
        renderGrowDetailScreen();

        fireEvent.press(screen.getByText("Archivieren"));

        const archiveButton = alertButtons.find((button) => button.text === "Archivieren");
        expect(archiveButton).toBeTruthy();

        await archiveButton.onPress();
        await waitFor(() => {
            expect(archive).toHaveBeenCalledWith("grow-001");
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });

        alertSpy.mockRestore();
    });
});