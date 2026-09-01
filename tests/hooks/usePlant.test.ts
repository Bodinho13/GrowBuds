import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useServices } from "../../services/ServicesContext";
import { usePlant } from "../../hooks/usePlant";

jest.mock("../../services/ServicesContext");

const mockGetById = jest.fn();


const plant = {
    id: "plant-001",
    name: "Northern Lights",
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
};

describe("usePlant", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useServices as jest.Mock).mockReturnValue({
            plantService: {
                getById: mockGetById,
            },
        });
    });

    it("loads a plant by id", async () => {
        mockGetById.mockResolvedValue(plant);

        const {result} = renderHook(() => usePlant("plant-001"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.plant).toEqual(plant);
        expect(mockGetById).toHaveBeenCalledTimes(1);
        expect(mockGetById).toHaveBeenCalledWith("plant-001");
    });

    it("return null for an unknown plant", async () => {
        mockGetById.mockResolvedValue(undefined);

        const {result} = renderHook(() => usePlant("does-not-exist"));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.plant).toBeNull();
        expect(mockGetById).toHaveBeenCalledWith("does-not-exist");
    });

    it("refreshes the plant", async () => {
        mockGetById.mockResolvedValue(plant);

        const {result} = renderHook(() => usePlant("plant-001"));

        await waitFor(() => {
            expect(result.current.plant).toEqual(plant);
        });
        expect(mockGetById).toHaveBeenCalledTimes(1);

        await act(async () => {
            await result.current.refresh();
        });

        expect(mockGetById).toHaveBeenCalledTimes(2);
        expect(mockGetById).toHaveBeenLastCalledWith("plant-001");
        expect(result.current.plant).toEqual(plant);
    });
    
    it("returns null when no plant id is provided", async () => {
        const {result} = renderHook(() => usePlant());

        await waitFor(() => {
            expect(result.current.plant).toBeNull();
        });
        expect(mockGetById).not.toHaveBeenCalled();
    });
});