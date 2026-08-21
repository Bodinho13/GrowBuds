import { renderHook, act } from "@testing-library/react-native";

import { usePlants } from "../../hooks/usePlants";
import { useServices } from "../../services/ServicesContext";

jest.mock("../../services/ServicesContext");

const mockGetAll = jest.fn();

const plants = [
    {
        id: "plant-001",
        name: "Northern Lights",
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
    },
];

describe("usePlants", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useServices as jest.Mock).mockReturnValue({
            plantService: {
                getAll: mockGetAll,
            },
        })
    });

    it("loads plants", async () => {
        mockGetAll.mockResolvedValue(plants);
        const {result} = await renderHook(() => usePlants());

        expect(result.current.loading).toBe(false);
        expect(result.current.plants).toEqual(plants);
        expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    it("refreshes plants", async () => {
        mockGetAll.mockResolvedValue(plants);

        const {result} = await renderHook(() => usePlants());

        expect(result.current.loading).toBe(false);
        expect(mockGetAll).toHaveBeenCalledTimes(1);

        await act (async () => {
            await result.current.refresh();
        });

        expect(mockGetAll).toHaveBeenCalledTimes(2);
        expect(result.current.plants).toEqual(plants);
    });
});