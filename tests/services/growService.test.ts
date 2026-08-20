import GrowService from "../../services/grows";
import { CreateGrowDto } from "../../types/dto/CreateGrowDto";
import { Grow } from "../../types/Grow";
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

    it("updates a grow", async () => {
        const grow: Grow = await growService.create({
            plantId: "plant-001",
            name: "Original Grow",
            startDate: new Date("2026-04-01"),
            amount: 1,
            stage: GrowStage.Vegetative,
            medium: GrowMedium.Soil,
            location: "Grow Room",
        });

        const originalCreatedAt = grow.createdAt;
        const originalStartDate = grow.startDate;
        const originalEndDate = grow.endDate;
        const originalPlantId = grow.plantId;

        const updatedGrow = await growService.update(
            grow.id,
            {
                name: "Updated Grow",
                amount: 2,
                location: "Another Room",
            }
        );

        expect(updatedGrow).toBeDefined();

        expect(updatedGrow?.id).toBe(grow.id);
        expect(updatedGrow?.plantId).toBe(originalPlantId);
        expect(updatedGrow?.startDate).toEqual(originalStartDate);
        expect(updatedGrow?.endDate).toEqual(originalEndDate);
        expect(updatedGrow?.createdAt).toEqual(originalCreatedAt);

        expect(updatedGrow?.name).toBe("Updated Grow");
        expect(updatedGrow?.amount).toBe(2);
        expect(updatedGrow?.location).toBe("Another Room");
        expect(updatedGrow?.updatedAt).toBeInstanceOf(Date);
    });

    it("returns undefined when updating a non-existing grow", async () => {
        const result = await growService.update(
            "does-not-exist",
            {name: "Updated Grow",}
        );
        expect(result).toBeUndefined();
    });

    it("archives a grow", async () => {
        const grow = await growService.create({
            plantId: "plant-001",
            name: "Grow to archive",
            startDate: new Date("2026-04-01"),
            amount: 1,
            stage: GrowStage.Vegetative,
            medium: GrowMedium.Soil,
        });

        const archivedGrow = await growService.archive(grow.id);

        expect(archivedGrow).toBeDefined();
        expect(archivedGrow?.id).toBe(grow.id);
        expect(archivedGrow?.endDate).toBeInstanceOf(Date);
        expect(archivedGrow?.isArchived).toBe(true);
        expect(archivedGrow?.updatedAt).toBeInstanceOf(Date);

        expect(archivedGrow?.name).toBe(grow.name);
        expect(archivedGrow?.plantId).toBe(grow.plantId);
        expect(archivedGrow?.startDate).toEqual(grow.startDate);
        expect(archivedGrow?.createdAt).toEqual(grow.createdAt);
    });

    it("returns undefined when archiving a non-existing grow", async () => {
        const result = await growService.archive("does-not-exist");
        expect(result).toBeUndefined();
    });

    it("returns undefined when archiving an archived grow", async () => {
        const grow = await growService.create({
            plantId: "plant_001",
            name: "test grow",
            startDate: new Date(),
            amount: 1,
            stage: GrowStage.Cutling,
            medium: GrowMedium.Soil,
        });
        await growService.archive(grow.id);
        const result = await growService.archive(grow.id);

        expect(result).toBeUndefined();
    });
});