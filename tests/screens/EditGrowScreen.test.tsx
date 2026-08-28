import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useGrow } from "../../hooks/useGrow";
import { useServices } from "../../services/ServicesContext";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";
import { NavigationContainer } from "@react-navigation/native";
import EditGrowScreen from "../../screens/EditGrowScreen";

jest.mock("../../hooks/useGrow");
jest.mock("../../services/ServicesContext");

const mockedUseGrow = jest.mocked(useGrow);
const mockedUseServices = jest.mocked(useServices);

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
} as any;
const mockRoute = {
    key: "EditGrow",
    name: "EditGrow",
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
};

function renderEditGrowScreen() {
    return render (
        <NavigationContainer>
            <EditGrowScreen
                navigation={mockNavigation}
                route={mockRoute}
            />
        </NavigationContainer>
    );
}

describe("EditGrowScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseServices.mockReturnValue({
            growService: {
                update: jest.fn()
            },
        } as any);
    });

    it("shows the loading view while the grow is loading", () => {
        mockedUseGrow.mockReturnValue({
            grow: null,
            loading: true,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        expect(screen.queryByText("Speichern")).toBeNull();
    });

    it("shows an empty state when the grow does not exist", () => {
        mockedUseGrow.mockReturnValue({
            grow: null,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();
        
        expect(screen.getByText("Grow wurde nicht gefunden.")).toBeTruthy();
        expect(screen.queryByText("Speichern")).toBeNull();
    });

    it("shows the grow data in the form", async () => {
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        await waitFor(() =>{
            expect(screen.getByDisplayValue("Sommer Grow")).toBeTruthy();
        });
        expect(screen.getByText("Northern Lights")).toBeTruthy();
        expect(screen.getByDisplayValue("4")).toBeTruthy();
        expect(screen.getByDisplayValue("Growbox")).toBeTruthy();
        expect(screen.getByDisplayValue("120")).toBeTruthy();
    });

    it("shows the correct labels", async () => {
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        await waitFor(() => {
            expect(screen.getByDisplayValue("Sommer Grow")).toBeTruthy();
        });
        expect(screen.getByText("Name")).toBeTruthy();
        expect(screen.getByText("Pflanze")).toBeTruthy();
        expect(screen.getByText("Menge")).toBeTruthy();
        expect(screen.getByText("Grow-Phase")).toBeTruthy();
        expect(screen.getByText("Medium")).toBeTruthy();
        expect(screen.getByText("Standort")).toBeTruthy();
        expect(screen.getByText("Gewicht")).toBeTruthy();
        expect(screen.getByText("Speichern")).toBeTruthy();
    });

    it("updates the grow and goes back", async () => {
        const update = jest.fn().mockResolvedValue({
            ...mockGrow,
            name: "Neuer Grow",
        });
        mockedUseServices.mockReturnValue({
            growService: {
                update,
            },
        } as any);
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        await waitFor(() => {
            expect(screen.getByDisplayValue("Sommer Grow")).toBeTruthy();
        });
        
        const nameInput = await screen.findByDisplayValue("Sommer Grow");
        
        fireEvent.changeText(nameInput, "Neuer Grow");
        fireEvent.press(screen.getByText("Speichern"));

        await waitFor(() => {
            expect(update).toHaveBeenCalledWith(
                "grow-001",
                expect.objectContaining({
                    id: "grow-001",
                    name: "Neuer Grow",
                    amount: 4,
                    stage: GrowStage.Vegetative,
                    medium: GrowMedium.Soil,
                    location: "Growbox",
                    weight: 120,
                })
            );
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
    });

    it("does not update when the name is empty", async () => {
        const update = jest.fn();
        mockedUseServices.mockReturnValue({
            growService: {
                update,
            },
        } as any);
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        const nameInput = await screen.findByDisplayValue("Sommer Grow");

        fireEvent.changeText(nameInput, "");
        fireEvent.press(screen.getByText("Speichern"));

        expect(update).not.toHaveBeenCalled();
        expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });

    it("does not update when the amount is invalid", async () => {
        const update = jest.fn();
        mockedUseServices.mockReturnValue({
            growService: {
                update,
            },
        } as any);
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        const amountInput = await screen.findByDisplayValue("4");

        fireEvent.changeText(amountInput, "0");
        fireEvent.press(screen.getByText("Speichern"));

        expect(update).not.toHaveBeenCalled();
        expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });

    it("does not update when the weight is invalid", async () => {
        const update = jest.fn();
        mockedUseServices.mockReturnValue({
            growService: {
                update,
            },
        } as any);
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        const weightInput = await screen.findByDisplayValue("120");

        fireEvent.changeText(weightInput, "-10");
        fireEvent.press(screen.getByText("Speichern"));

        expect(update).not.toHaveBeenCalled();
        expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });

    it("sets empty optional fields to undefined", async () => {
        const update = jest.fn().mockResolvedValue({
            ...mockGrow,
            location: undefined,
            weight: undefined,
        });
        mockedUseServices.mockReturnValue({
            growService: {
                update,
            },
        } as any);
        mockedUseGrow.mockReturnValue({
            grow: mockGrow,
            loading: false,
            refresh: jest.fn(),
        });
        renderEditGrowScreen();

        const locationInput = await screen.findByDisplayValue("Growbox");
        const weightInput = await screen.findByDisplayValue("120");

        fireEvent.changeText(locationInput, "");
        fireEvent.changeText(weightInput, "");
        fireEvent.press(screen.getByText("Speichern"));

        await waitFor(() => {
            expect(update).toHaveBeenCalledWith(
                "grow-001",
                expect.objectContaining({
                    location: undefined,
                    weight: undefined,
                })
            );
            expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
        });
    });
});