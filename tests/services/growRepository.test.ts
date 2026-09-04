import { GrowRepository } from "../../services/grows/growRepository";
import { updateGrowSql } from "../../services/grows/growSql";
import { SQLiteStorage } from "../../services/storage/sqliteStorage";

import { Grow } from "../../types/Grow";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";

describe("GrowRepository", () => {
    const execute = jest.fn().mockResolvedValue(1);

    const storage = {
        execute,
        getAll: jest.fn(),
        getFirst: jest.fn(),
    } as unknown as SQLiteStorage;

    const repository = new GrowRepository(storage);

    beforeEach(() => {
        execute.mockClear();
    });

    it("creates a grow", async () => {
        const grow: Grow = {
            id: "grow-test-001",
            plantId: "plant-001",
            name: "Test Grow",
            startDate: new Date("2026-04-01"),
            amount: 1,
            stage: GrowStage.Vegetative,
            medium: GrowMedium.Soil,
            location: "Grow Room",
            createdAt: new Date("2026-04-01"),
            updatedAt: new Date("2026-04-01"),
            isArchived: false,
        };

        const result = await repository.create(grow);

        expect(result).toEqual(grow);
        expect(execute).toHaveBeenCalledTimes(1);
    });

    it("updates a grow", async () => {
        const grow: Grow = {
            id: "grow-update-001",
            plantId: "plant-001",
            name: "Updated Grow",
            startDate: new Date("2026-04-01"),
            amount: 2,
            stage: GrowStage.Vegetative,
            medium: GrowMedium.Soil,
            location: "Updated Room",
            weight: 42.5,
            createdAt: new Date("2026-04-01"),
            updatedAt: new Date("2026-04-02"),
            isArchived: false,
        };

        const result = await repository.update(grow);

        expect(result).toEqual(grow);
        expect(execute).toHaveBeenCalledTimes(1);
    });

    it("archives a grow", async () => {
        const endDate = new Date("2026-05-01");
        const startDate = new Date("2026-04-01");
        const grow: Grow = {
            id: "grow-archive-001",
            plantId: "plant-001",
            growGroupId: undefined,
            name: "Archived Grow",
            startDate,
            endDate,
            amount: 1,
            stage: GrowStage.Harvest,
            medium: GrowMedium.Soil,
            createdAt: startDate,
            updatedAt: endDate,
            isArchived: true,
        };

        const result = await repository.update(grow);

        expect(result).toEqual(grow);
        expect(execute).toHaveBeenCalledTimes(1);
        expect(execute).toHaveBeenCalledWith(updateGrowSql, [
            null,
            grow.name,
            grow.amount,
            grow.stage,
            grow.medium,
            null,
            null,
            grow.endDate?.toISOString(),
            grow.updatedAt.toISOString(),
            1,
            grow.id,
        ]);
    });
});