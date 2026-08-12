import GrowService from "../../services/grows";
import { CreateGrowDto } from "../../types/dto/CreateGrowDto";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";
import { MockGrowRepository } from "../mocks/mockGrowRepository";

describe("GrowService", () => {
    let repository: MockGrowRepository;
    let growService: GrowService;

    beforeEach(() => {
        repository = new MockGrowRepository();
        growService = new GrowService(repository);
    });

    it("return all grows", async () => {
        const grows = await growService.getAll();
        expect(grows.length).toBeGreaterThan(0);
    });

    it("returns a grow by id", async () => {
        const grows = await growService.getAll();
        const grow = await growService.getById(grows[0].id);

        expect(grow).toBeDefined();
        expect(grow?.id).toBe(grows[0].id);
    });

    it("returns undefined for unknown grow id", async () => {
        const grow = await growService.getById("invalid-id");
        expect(grow).toBeUndefined();
    });

    it("creates a grow", async () => {
        const dto: CreateGrowDto = {
            plantId: "plant-001",
            name: "Test Grow",
            startDate: new Date("2026-04-01"),
            amount: 1,
            stage: GrowStage.Vegetative,
            medium: GrowMedium.Soil,
            location: "Tent left side in the back",
        };

        const grow = await growService.create(dto);

        expect(grow.name).toBe("Test Grow");
        expect(grow.plantId).toBe("plant-001");
        expect(grow.startDate).toEqual(dto.startDate);
        expect(grow.amount).toBe(1);
        expect(grow.stage).toBe(dto.stage);
        expect(grow.medium).toBe(dto.medium);
        expect(grow.location).toBe("Tent left side in the back");

        expect(grow.id).toBeDefined();
        expect(grow.createdAt).toBeInstanceOf(Date);
        expect(grow.updatedAt).toBeInstanceOf(Date);
        expect(grow.isArchived).toBe(false);
    });
});