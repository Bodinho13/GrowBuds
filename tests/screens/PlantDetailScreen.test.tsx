import { NavigationContainer } from "@react-navigation/native";
import { usePlant } from "../../hooks/usePlant";
import PlantDetailScreen from "../../screens/PlantDetailScreen";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useServices } from "../../services/ServicesContext";
import { Alert } from "react-native";

jest.mock("../../hooks/usePlant");
jest.mock("../../services/ServicesContext");

const mockedUsePlant = jest.mocked(usePlant);
const mockedUseServices = jest.mocked(useServices);

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
} as any;

const mockRoute = {
    key: "PlantDetail",
    name: "PlantDetail",
    params: {
        plantId: "plant-001",
    },
} as any;

async function renderPlantDetailScreen() {
    return render(
        <NavigationContainer>
            <PlantDetailScreen
                navigation={mockNavigation}
                route={mockRoute}
            />
        </NavigationContainer>
    );
}

describe("PlantDetailScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseServices.mockReturnValue({
            plantService: {
                archive: jest.fn(),
            },
        } as any);
    });

    it("shows the loading view while the plant is loading", async () => {
        mockedUsePlant.mockReturnValue({
            plant: null,
            loading: true,
            refresh: jest.fn(),
        });
        await renderPlantDetailScreen();

        expect(screen.queryByText("Pflanze nicht gefunden.")).toBeNull();
    });

    it("shows empty state when the plant does not exist", async () => {
        mockedUsePlant.mockReturnValue({
            plant: null,
            loading: false,
            refresh: jest.fn(),
        });
        await renderPlantDetailScreen();
        expect(screen.getByText("Pflanze nicht gefunden.")).toBeTruthy();
    });

    it("shows the plant details", async () => {
        const plant = {
            id: "plant-001",
            name: "Northern Lights",
            strain: "Indica",
            cross: "Northern Lights x Unknown",
            breeder: "Tester",
            notes: "Meine Testpflanze",
            createdAt: new Date("2026-08-01"),
            updatedAt: new Date("2026-08-19"),
            isArchived: false,
        };
        mockedUsePlant.mockReturnValue({
            plant,
            loading: false,
            refresh: jest.fn(),
        });

        await renderPlantDetailScreen();

        expect(screen.getByText("Northern Lights")).toBeTruthy();
        expect(screen.getByText("Indica")).toBeTruthy();
        expect(screen.getByText("Northern Lights x Unknown")).toBeTruthy();
        expect(screen.getByText("Tester")).toBeTruthy();
        expect(screen.getByText("Meine Testpflanze")).toBeTruthy();
    });

    it("navigates to edit plant when the edit button is pressed", async () => {
        const plant = {
            id: "plant-001",
            name: "Northern Lights",
            createdAt: new Date("2026-08-01"),
            updatedAt: new Date("2026-08-19"),
            isArchived: false,
        };
        mockedUsePlant.mockReturnValue({
            plant,
            loading: false,
            refresh: jest.fn(),
        });

        await renderPlantDetailScreen();

        fireEvent.press(screen.getByText("Bearbeiten"));

        expect(mockNavigation.navigate).toHaveBeenCalledWith(
            "EditPlant",
            {plantId: "plant-001",}
        );
    });

    it("shows the archive confirmation alert", async () => {
        const plant = {
            id: "plant-001",
            name: "Northern Lights",
            createdAt: new Date("2026-08-01"),
            updatedAt: new Date("2026-08-19"),
            isArchived: false,
        };
        mockedUsePlant.mockReturnValue({
            plant,
            loading: false,
            refresh: jest.fn(),
        });

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        await renderPlantDetailScreen();

        fireEvent.press(screen.getByText("Archivieren"));

        expect(alertSpy).toHaveBeenCalledWith(
            "Pflanze archivieren",
            'Möchtest du "Northern Lights" wirklich archivieren?',
            expect.any(Array),
        );

        alertSpy.mockRestore();
    });

    it("archives the plant when archive is confirmed", async () => {
        const archive = jest.fn().mockResolvedValue({
            id: "plant-001",
            name: "Northern Lights",
            createdAt: new Date("2026-08-01"),
            updatedAt: new Date("2026-08-24"),
            isArchived: true,
            archivedAt: new Date("2026-08-24"),
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                archive,
            },
        } as any);

        mockedUsePlant.mockReturnValue({
            plant: {
                id: "plant-001",
                name: "Northern Lights",
                createdAt: new Date("2026-08-01"),
                updatedAt: new Date("2026-08-19"),
                isArchived: false,
            },
            loading: false,
            refresh: jest.fn(),
        });
        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        await renderPlantDetailScreen();

        fireEvent.press(screen.getByText("Archivieren"));

        const buttons = alertSpy.mock.calls[0][2];
        const confirmButton = buttons?.find(
            (button) => button.text === "Archivieren"
        );

        expect(confirmButton).toBeDefined();
        await confirmButton?.onPress?.();
        expect(archive).toHaveBeenCalledWith("plant-001");
        alertSpy.mockRestore();
    });

    it("goes back after successfully archiving the plant", async () => {
        const archive = jest.fn().mockResolvedValue({
            id: "plant-001",
            name: "Northern Lights",
            createdAt: new Date("2026-08-01"),
            updatedAt: new Date("2026-08-24"),
            isArchived: true,
            archivedAt: new Date("2026-08-24"),
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                archive,
            },
        } as any);

        mockedUsePlant.mockReturnValue({
            plant: {
                id: "plant-001",
                name: "Northern Lights",
                createdAt: new Date("2026-08-01"),
                updatedAt: new Date("2026-08-19"),
                isArchived: false,
            },
            loading: false,
            refresh: jest.fn(),
        });
        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        await renderPlantDetailScreen();

        fireEvent.press(screen.getByText("Archivieren"));

        const buttons = alertSpy.mock.calls[0][2];
        const confirmButton = buttons?.find(
            (button) => button.text === "Archivieren"
        );
        await confirmButton?.onPress?.();

        expect(archive).toHaveBeenCalledWith("plant-001");
        expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);

        alertSpy.mockRestore();
    });

    it("shows an error when the plant could not be archived", async () => {
        const archive = jest.fn().mockResolvedValue(undefined);
        mockedUseServices.mockReturnValue({
            plantService: {
                archive,
            },
        } as any);
        mockedUsePlant.mockReturnValue({
            plant: {
                id: "plant-001",
                name: "Northern Lights",
                createdAt: new Date("2026-08-01"),
                updatedAt: new Date("2026-08-19"),
                isArchived: false,
            },
            loading: false,
            refresh: jest.fn(),
        });

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        await renderPlantDetailScreen();
        fireEvent.press(screen.getByText("Archivieren"));
        const buttons = alertSpy.mock.calls[0][2];
        const confirmButton = buttons?.find((button) => button.text === "Archivieren");
        await confirmButton?.onPress?.();

        expect(archive).toHaveBeenCalledWith("plant-001");
        expect(alertSpy).toHaveBeenLastCalledWith(
            "Fehler",
            "Die Pflanze konnte nicht archiviert werden."
        );
        expect(mockNavigation.goBack).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it("shows an error when archiving throws", async () => {
        const archive = jest.fn().mockRejectedValue(new Error("Database error"));
        mockedUseServices.mockReturnValue({
            plantService: {
                archive,
            },
        } as any);
        mockedUsePlant.mockReturnValue({
            plant: {
                id: "plant-001",
                name: "Northern Lights",
                createdAt: new Date("2026-08-01"),
                updatedAt: new Date("2026-08-19"),
                isArchived: false,
            },
            loading: false,
            refresh: jest.fn(),
        });

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        await renderPlantDetailScreen();
        fireEvent.press(screen.getByText("Archivieren"));
        const buttons = alertSpy.mock.calls[0][2];
        const confirmButton = buttons?.find(
            (button) => button.text === "Archivieren"
        );
        await confirmButton?.onPress?.();

        expect(archive).toHaveBeenCalledWith("plant-001");
        expect(alertSpy).toHaveBeenLastCalledWith(
            "Fehler",
            "Die Pflanze konnte nicht archiviert werden.",
        );
        expect(mockNavigation.goBack).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    })
});