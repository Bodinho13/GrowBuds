import { act, renderHook } from "@testing-library/react-native";
import { useServices } from "../../services/ServicesContext";
import { useGrows } from "../../hooks/useGrows";

jest.mock("../../services/ServicesContext");

const mockGetAll = jest.fn();

const grows = [
    {
        id: "grow-001",
        plantId: "plant-001",
        name: "First Grow",
        startDate: new Date("2026-04-01"),
        amount: 1,
        stage: "Vegetative",
        medium: "Erde",
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchved: false,
    },
];

describe("useGrows", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useServices as jest.Mock).mockReturnValue({
            growService: {
                getAll: mockGetAll,
            },
        });
    });

    it("loads grows", async () => {
        

        mockGetAll.mockResolvedValue(grows);

        const {result} = await renderHook(() => useGrows());

        expect(result.current.loading).toBe(false);
        expect(result.current.grows).toEqual(grows);
        expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    it("refreshes grows", async () => {
        mockGetAll.mockResolvedValue(grows);
        const {result} = await renderHook(() => useGrows());
        
        expect(mockGetAll).toHaveBeenCalledTimes(1);

        await act (async () => {
            await result.current.refresh();
        });

        expect(mockGetAll).toHaveBeenCalledTimes(2);
        expect(result.current.grows).toEqual(grows);
    });
});