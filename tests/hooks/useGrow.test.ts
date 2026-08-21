import { act, renderHook } from "@testing-library/react-native";
import { useServices } from "../../services/ServicesContext";
import { useGrow } from "../../hooks/useGrow";

jest.mock("../../services/ServicesContext");

const mockGetById = jest.fn();

const grow = {
    id: "grow-001",
    plantId: "plant-001",
    name: "First Grow",
    startDate: new Date("2026-04-01"),
    amount: 1,
    stage: "Vegetative",
    medium: "Erde",
    createdAt: new Date(),
    updatedat: new Date(),
    isArchived: false,
};

describe("useGrow", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useServices as jest.Mock).mockReturnValue({
            growService: {
                getById: mockGetById,
            },
        });
    });

    it("loads a grow by id", async () => {
        mockGetById.mockResolvedValue(grow);

        const {result} = await renderHook(() => useGrow("grow-001"));

        expect(result.current.loading).toBe(false);
        expect(result.current.grow).toEqual(grow);
        expect(mockGetById).toHaveBeenCalledTimes(1);
        expect(mockGetById).toHaveBeenCalledWith("grow-001");
    });

    it("returns null for an unknown grow", async () => {
        mockGetById.mockResolvedValue(undefined);

        const {result} = await renderHook(() => useGrow("does-not-exist"));

        expect(result.current.loading).toBe(false);
        expect(result.current.grow).toBeNull();
        expect(mockGetById).toHaveBeenCalledWith("does-not-exist");
    });

    it("refreshes ten grow", async () => {
        mockGetById.mockResolvedValue(grow);

        const {result} = await renderHook(() => useGrow("grow-001"));

        expect(mockGetById).toHaveBeenCalledTimes(1);

        await act (async () => {
            await result.current.refresh();
        });

        expect(mockGetById).toHaveBeenCalledTimes(2),
        expect(mockGetById).toHaveBeenCalledWith("grow-001"),
        expect(result.current.grow).toEqual(grow);
    });
});