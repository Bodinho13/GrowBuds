import { NavigationContainer } from "@react-navigation/native";
import { useServices } from "../../services/ServicesContext";
import CreatePlantScreen from "../../screens/CreatePlantScreen";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

jest.mock("../../services/ServicesContext");

const mockedUseServices = jest.mocked(useServices);
const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
} as any;
const mockRoute = {
    key: "CreatePlant",
    name: "CreatePlant",
    params: undefined,
} as any;

function renderCreatePlantScreen() {
    return render(
        <NavigationContainer>
            <CreatePlantScreen
                navigation={mockNavigation}
                route={mockRoute}
            />
        </NavigationContainer>
    );
}

describe("CreatePlantScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseServices.mockReturnValue({
            plantService: {
                create: jest.fn(),
            },
        } as any);
    });

    it("shows an empty form initially", async () => {
        renderCreatePlantScreen();

        expect(screen.getByPlaceholderText("Name der Pflanze")).toHaveProp("value", "");
        expect(screen.getByPlaceholderText("z.B. Indica")).toHaveProp("value", "");
        expect(screen.getByPlaceholderText("z.B. A x B")).toHaveProp("value", "");
        expect(screen.getByPlaceholderText("Züchter")).toHaveProp("value", "");
        expect(screen.getByPlaceholderText("Notizen")).toHaveProp("value", "");
        expect(screen.getByText("Pflanze erstellen")).toBeTruthy();
    });

    it("shows an error when saving without a name", async () => {
        const create = jest.fn();
        mockedUseServices.mockReturnValue({
            plantService: {
                create,
            },
        } as any);

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        renderCreatePlantScreen();
        fireEvent.press(screen.getByText("Pflanze erstellen"));

        expect(alertSpy).toHaveBeenCalledWith("Fehler",
            "Bitte gib einen Namen für die Pflanze ein.",
        );
        expect(create).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it("creates a plant with the entered values", async () => {
        const create = jest.fn().mockResolvedValue({
            id: "plant-002",
            name: "Blue Dream",
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                create,
            },
        } as any);
        renderCreatePlantScreen();

        fireEvent.changeText(screen.getByPlaceholderText("Name der Pflanze"), "Blue Dream");
        fireEvent.changeText(screen.getByPlaceholderText("z.B. Indica"), "Indica");
        fireEvent.changeText(screen.getByPlaceholderText("z.B. A x B"), "A x B");
        fireEvent.changeText(screen.getByPlaceholderText("Züchter"), "Tester");
        fireEvent.changeText(screen.getByPlaceholderText("Notizen"), "Meine Notizen");
        fireEvent.press(screen.getByText("Pflanze erstellen"));

        await waitFor(() => {
            expect(create).toHaveBeenCalledWith({
                name: "Blue Dream",
                strain: "Indica",
                cross: "A x B",
                breeder: "Tester",
                notes: "Meine Notizen",
            });
        });
    });

    it("uses undefined for empty optional fields", async () => {
        const create = jest.fn().mockResolvedValue({
            id: "plant-002",
            name: "Blue Dream",
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                create,
            },
        } as any);
        renderCreatePlantScreen();

        fireEvent.changeText(screen.getByPlaceholderText("Name der Pflanze"), "Blue Dream");
        fireEvent.press(screen.getByText("Pflanze erstellen"));

        await waitFor(() => {
            expect(create).toHaveBeenCalledWith({
                name: "Blue Dream",
                strain: undefined,
                cross: undefined,
                breeder: undefined,
                notes: undefined,
            });
        });
    });

    it("goes back after successfully creating the plant", async () => {
        const create = jest.fn().mockResolvedValue({
            id: "plant-002",
            name: "Blue Dream",
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                create,
            },
        } as any);
        renderCreatePlantScreen();

        fireEvent.changeText(screen.getByPlaceholderText("Name der Pflanze"), "Blue Dream");
        fireEvent.press(screen.getByText("Pflanze erstellen"));

        await waitFor(() => {
            expect(create).toHaveBeenCalled();
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
    });

    it("shows an error when creating the plant fails", async () => {
        const create = jest.fn().mockRejectedValue(new Error("Database error"));
        mockedUseServices.mockReturnValue({
            plantService: {
                create,
            },
        } as any);

        const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
        renderCreatePlantScreen();

        fireEvent.changeText(screen.getByPlaceholderText("Name der Pflanze"), "Blue Dream");
        fireEvent.press(screen.getByText("Pflanze erstellen"));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("Fehler", "Die Pflanze konnte nicht erstellt werden.");
        });
        expect(mockNavigation.goBack).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});