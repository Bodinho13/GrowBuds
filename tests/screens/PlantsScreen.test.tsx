import { fireEvent, render, screen } from "@testing-library/react-native";
import { usePlants } from "../../hooks/usePlants";
import PlantsScreen from "../../screens/PlantsScreen";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("../../hooks/usePlants");

const mockedUsePlants = jest.mocked(usePlants);

const mockNavigation = {
    navigate: jest.fn(),
} as any;

const mockRoute = {
    key: "PlantsList",
    name: "PlantsList",
    params: undefined,
} as any;

async function renderPlantsScreen() {
    return render(
        <NavigationContainer>
            <PlantsScreen
                navigation={mockNavigation}
                route={mockRoute}
            />
        </NavigationContainer>
    );
}

describe("PlantsScreen", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows the loading view while plants are loading", async () => {
        mockedUsePlants.mockReturnValue({
            plants: [],
            loading: true,
            refresh: jest.fn(),
        });

        await renderPlantsScreen();

        expect(screen.queryByText("Aktive Pflanzen")).toBeNull();
    });

    it("shows active and archived plants", async () => {
        mockedUsePlants.mockReturnValue({
            plants: [
                {
                    id: "plant-001",
                    name: "Northern Lights",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isArchived: false,
                },
                {
                    id: "plant-002",
                    name: "Archived Plant",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isArchived: true,
                },
            ],
            loading: false,
            refresh: jest.fn(),
        });

        await renderPlantsScreen();

        expect(screen.getByText("Aktive Pflanzen")).toBeTruthy();
        expect(screen.getByText("Archivierte Pflanzen")).toBeTruthy();
        expect(screen.getByText("Northern Lights")).toBeTruthy();
        expect(screen.getByText("Archived Plant")).toBeTruthy();
    });

    it("navigates to plant detail when a plant is pressed", async () => {
        mockedUsePlants.mockReturnValue({
            plants: [
                {
                    id: "plant-001",
                    name: "Northern Lights",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isArchived: false,
                },
            ],
            loading: false,
            refresh: jest.fn(),
        });
        await renderPlantsScreen();

        fireEvent.press(screen.getByText("Northern Lights"));
        expect(mockNavigation.navigate).toHaveBeenCalledWith(
            "PlantDetail",
            {
                plantId: "plant-001",
            }
        );
    });

    it("navigates to create plant when the create button is pressed", async () => {
        mockedUsePlants.mockReturnValue({
            plants: [],
            loading: false,
            refresh: jest.fn(),
        });
        await renderPlantsScreen();

        fireEvent.press(screen.getByText("+ Neue Pflanze"));
        expect(mockNavigation.navigate).toHaveBeenCalledWith("CreatePlant");
    });

    it("refreshes plants when the screen gets focus", async () => {
        const refresh = jest.fn();

        mockedUsePlants.mockReturnValue({
            plants: [],
            loading: false,
            refresh,
        });
        await renderPlantsScreen();

        expect(refresh).toHaveBeenCalled();
    });
});