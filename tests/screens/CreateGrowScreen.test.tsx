import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useServices } from "../../services/ServicesContext";
import { Plant } from "../../types/Plant";
import { NavigationContainer } from "@react-navigation/native";
import CreateGrowScreen from "../../screens/CreateGrowScreen";
import { GrowStage } from "../../types/GrowStage";
import { GrowMedium } from "../../types/GrowMedium";

jest.mock("../../services/ServicesContext");
jest.mock("@react-native-community/datetimepicker", () => {
    const React = require("react");
    const { Pressable, Text } = require("react-native");

    return function MockDateTimePicker(props: any) {
        return(
            <Pressable
                testID="date-picker"
                onPress={() => props.onChange?.(
                    {},
                    new Date("2026-08-20")
                )}
            >
                <Text>Datum auswählen</Text>
            </Pressable>
        );
    };
});

const mockedUseServices = jest.mocked(useServices);
const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
} as any;
const mockPlants: Plant[] = [
    {
        id: "plant-001",
        name: "Northern Lights",
        strain: "Indica",
        createdAt: new Date("2026-08-01"),
        updatedAt: new Date("2026-08-19"),
        isArchived: false,
    },
    {
        id: "plant-002",
        name: "Blue Dream",
        strain: "Hybrid",
        createdAt: new Date("2026-08-02"),
        updatedAt: new Date("2026-08-21"),
        isArchived: false,
    },
];

function renderCreateGrowScreen() {
    return render(
        <NavigationContainer>
            <CreateGrowScreen
                navigation={mockNavigation}
                route={{} as any}
            />
        </NavigationContainer>
    );
}

describe("CreateGrowScreen", () => {
    const getAll = jest.fn();
    const create = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        getAll.mockResolvedValue(mockPlants);
        create.mockResolvedValue({
            id: "grow-001",
            plantId: "plant-001",
            name: "Sommer Grow",
        });
        mockedUseServices.mockReturnValue({
            plantService: {
                getAll,
            },
            growService: {
                create,
            },
        } as any);
    });

    it("shows the create grow form", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Pflanze")).toBeTruthy();
        });
        expect(screen.getByText("Name")).toBeTruthy();
        expect(screen.getByText("Menge")).toBeTruthy();
        expect(screen.getByText("Startdatum")).toBeTruthy();
        expect(screen.getByText("Grow-Phase")).toBeTruthy();
        expect(screen.getByText("Medium")).toBeTruthy();
        expect(screen.getByText("Standort")).toBeTruthy();
        expect(screen.getByText("Grow erstellen")).toBeTruthy();
    });

    it("loads the plants and selects the first plant", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(getAll).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText("Northern Lights")).toBeTruthy();
    });

    it("shows a message when no plants exist", async () => {
        getAll.mockResolvedValue([]);
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Keine Pflanzen vorhanden. Bitte zuerst eine Pflanze anlegen.")).toBeTruthy();
        });
        expect(screen.getByText("Grow erstellen")).toBeTruthy();
    });

    it("disables the create button when no name is entered", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });
        
        expect(screen.getByTestId("create-grow-button")).toBeDisabled();
    });

    it("disables the create button when the amount is invalid", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });

        const amountInput = screen.getByPlaceholderText("Anzahl");
        const button = screen.getByTestId("create-grow-button");

        fireEvent.changeText(screen.getByPlaceholderText("Name des Grows"), "Sommer Grow");
        fireEvent.changeText(amountInput, "0");

        expect(button).toBeDisabled();

        fireEvent.changeText(amountInput, "-1");
        
        expect(button).toBeDisabled();

        fireEvent.changeText(amountInput, "1.5");
        
        expect(button).toBeDisabled();
    });

    it("enables the create button when valid required data is entered", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });

        fireEvent.changeText(screen.getByPlaceholderText("Name des Grows"), "Sommer Grow");
        fireEvent.changeText(screen.getByPlaceholderText("Anzahl"), "4");

        expect(screen.getByTestId("create-grow-button")).toBeEnabled();
    });

    it("creates a grow with the entered data", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });

        fireEvent.changeText(screen.getByPlaceholderText("Name des Grows"), " Sommer Grow ");
        fireEvent.changeText(screen.getByPlaceholderText("Anzahl"), "4");
        fireEvent.changeText(screen.getByPlaceholderText("Standort (optional)"), " Growbox ");
        fireEvent.press(screen.getByText("Grow erstellen"));

        await waitFor(() => {
            expect(create).toHaveBeenCalledTimes(1);
        });
        expect(create).toHaveBeenCalledWith(
            expect.objectContaining({
                plantId: "plant-001",
                name: "Sommer Grow",
                amount: 4,
                stage: GrowStage.Seed,
                medium: GrowMedium.Coco,
                location: "Growbox",
                startDate: expect.any(Date),
            })
        );
    });

    it("goes back after successfully creating a grow", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });
        fireEvent.changeText(screen.getByPlaceholderText("Name des Grows"), "Sommer Grow");
        fireEvent.changeText(screen.getByPlaceholderText("Anzahl"), "4");
        fireEvent.press(screen.getByText("Grow erstellen"));

        await waitFor(() => {
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
    });

    it("changes the start date", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });

        fireEvent.press(screen.getByTestId("date-picker"));
        fireEvent.changeText(screen.getByPlaceholderText("Name des Grows"), "Sommer Grow");
        fireEvent.changeText(screen.getByPlaceholderText("Anzahl"), "4");
        fireEvent.press(screen.getByText("Grow erstellen"));

        await waitFor(() => {
            expect(create).toHaveBeenCalledWith(expect.objectContaining({
                startDate: new Date("2026-08-20"),
            }));
        });
    });

    it("allows changing the selected plant", async () => {
        renderCreateGrowScreen();

        await waitFor(() => {
            expect(screen.getByText("Northern Lights")).toBeTruthy();
        });
        fireEvent.press(screen.getByText("Northern Lights"));

        await waitFor(() => {
            expect(screen.getByText("Blue Dream")).toBeTruthy();
        });
        fireEvent.press(screen.getByText("Blue Dream"));
        fireEvent.changeText(screen.getByPlaceholderText("Name des Grows"), "Winter Grow");
        fireEvent.changeText(screen.getByPlaceholderText("Anzahl"), "2");
        fireEvent.press(screen.getByText("Grow erstellen"));

        await waitFor(() => {
            expect(create).toHaveBeenCalledWith(
                expect.objectContaining({
                    plantId: "plant-002",
                })
            );
        });
    });
});