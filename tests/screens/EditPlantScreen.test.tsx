import { NavigationContainer } from "@react-navigation/native";
import { usePlant } from "../../hooks/usePlant";
import { useServices } from "../../services/ServicesContext";
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import EditPlantScreen from "../../screens/EditPlantScreen";
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
    key: "EditPlant",
    name: "EditPlant",
    params: {
        plantId: "plant-001",
    },
} as any;

const mockPlant_short = {
    id: "plant-001",
    name: "Northern Lights",
    createdAt: new Date("2026-08-01"),
    updatedAt: new Date("2026-08-19"),
    isArchived: false,
};

function renderEditPlantScreen() {
    return render(
        <NavigationContainer>
            <EditPlantScreen navigation={mockNavigation} route={mockRoute} />
        </NavigationContainer>,
    );
}

describe("EditPlantScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseServices.mockReturnValue({
            plantService: {
                update: jest.fn(),
            },
        } as any);
    });

    it("shows the loading view while the plant is loading", async () => {
        mockedUsePlant.mockReturnValue({
            plant: null,
            loading: true,
            refresh: jest.fn(),
        });
        await renderEditPlantScreen();

        expect(screen.queryByText("Änderungen speichern")).toBeNull();
    });

    it("shows an empty state when the plant does not exist", async () => {
        mockedUsePlant.mockReturnValue({
            plant: null,
            loading: false,
            refresh: jest.fn(),
        });
        await renderEditPlantScreen();

        expect(screen.getByText("Pflanze wurde nicht gefunden.")).toBeTruthy();
        expect(screen.queryByText("Änderungen speichern")).toBeNull();
    });

    it("prefills the form with the plant data", async () => {
        mockedUsePlant.mockReturnValue({
            plant: {
                ...mockPlant_short,
                strain: "Indica",
                cross: "A x B",
                breeder: "Tester",
                notes: "Meine Notizen",
            },
            loading: false,
            refresh: jest.fn(),
        });
        await renderEditPlantScreen();

        expect(screen.getByDisplayValue("Northern Lights")).toBeTruthy();
        expect(screen.getByDisplayValue("Indica")).toBeTruthy();
        expect(screen.getByDisplayValue("A x B")).toBeTruthy();
        expect(screen.getByDisplayValue("Tester")).toBeTruthy();
        expect(screen.getByDisplayValue("Meine Notizen")).toBeTruthy();
    });

    it("uses empty strings for missing optional plant fields", async () => {
        mockedUsePlant.mockReturnValue({
            plant: mockPlant_short,
            loading: false,
            refresh: jest.fn(),
        });
        await renderEditPlantScreen();

        expect(screen.getByDisplayValue("Northern Lights")).toBeTruthy();
        expect(screen.getByPlaceholderText("z.B. Indica")).toHaveProp(
            "value",
            "",
        );
        expect(screen.getByPlaceholderText("z.B. A x B")).toHaveProp(
            "value",
            "",
        );
        expect(screen.getByPlaceholderText("z.B. Cookies")).toHaveProp(
            "value",
            "",
        );
        expect(screen.getByPlaceholderText("Notizen")).toHaveProp("value", "");
    });

    it("updates the name when the name is changed", async () => {
        mockedUsePlant.mockReturnValue({
            plant: mockPlant_short,
            loading: false,
            refresh: jest.fn(),
        });
        await renderEditPlantScreen();

        const nameInput = screen.getByDisplayValue("Northern Lights");
        fireEvent.changeText(nameInput, "Super Northern Lights");

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("Super Northern Lights"),
            ).toBeTruthy();
        });
    });

    it("updates the plant with the entered values", async () => {
        const update = jest.fn().mockResolvedValue({
            ...mockPlant_short,
            name: "Updated Plant",
            strain: "Indica",
            cross: "A x B",
            breeder: "Tester",
            notes: "updated notes",
            updatedAt: new Date("2026-08-24"),
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                update,
            },
        } as any);
        mockedUsePlant.mockReturnValue({
            plant: {
                ...mockPlant_short,
                strain: "Sativa",
                cross: "Old Cross",
                breeder: "Old Breeder",
                notes: "Old Notes",
            },
            loading: false,
            refresh: jest.fn(),
        });
        await renderEditPlantScreen();

        const nameInput = screen.getByDisplayValue("Northern Lights");
        const strainInput = screen.getByDisplayValue("Sativa");
        const crossInput = screen.getByDisplayValue("Old Cross");
        const breederInput = screen.getByDisplayValue("Old Breeder");
        const notesInput = screen.getByDisplayValue("Old Notes");

        fireEvent.changeText(nameInput, "Updated Plant");
        fireEvent.changeText(strainInput, "Indica");
        fireEvent.changeText(crossInput, "A x B");
        fireEvent.changeText(breederInput, "Tester");
        fireEvent.changeText(notesInput, "updated notes");
        fireEvent.press(screen.getByText("Änderungen speichern"));

        await waitFor(() => {
            expect(update).toHaveBeenCalledWith("plant-001", {
                name: "Updated Plant",
                strain: "Indica",
                cross: "A x B",
                breeder: "Tester",
                notes: "updated notes",
            });
        });
    });

    it("goes back after successfully updating the plant", async () => {
        const update = jest.fn().mockResolvedValue({
            ...mockPlant_short,
            name: "Updated Plant",
            updatedAt: new Date("2026-08-24"),
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                update,
            },
        } as any);
        mockedUsePlant.mockReturnValue({
            plant: mockPlant_short,
            loading: false,
            refresh: jest.fn(),
        });
        await renderEditPlantScreen();

        const nameInput = screen.getByDisplayValue("Northern Lights");
        fireEvent.changeText(nameInput, "Updated Plant");
        fireEvent.press(screen.getByText("Änderungen speichern"));

        await waitFor(() => {
            expect(update).toHaveBeenCalled();
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
    });

    it("shows an error when saving without a name", async () => {
        const update = jest.fn();
        mockedUseServices.mockReturnValue({
            plantService: {
                update,
            },
        } as any);
        mockedUsePlant.mockReturnValue({
            plant: mockPlant_short,
            loading: false,
            refresh: jest.fn(),
        });

        const alertSpy = jest
            .spyOn(Alert, "alert")
            .mockImplementation(() => {});
        await renderEditPlantScreen();

        const nameInput = screen.getByDisplayValue("Northern Lights");
        fireEvent.changeText(nameInput, "   ");
        fireEvent.press(screen.getByText("Änderungen speichern"));

        expect(alertSpy).toHaveBeenCalledWith(
            "Fehler",
            "Bitte gib einen Namen für die Pflanze ein.",
        );
        expect(update).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
