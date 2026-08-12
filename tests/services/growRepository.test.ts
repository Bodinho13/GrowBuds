import { GrowRepository } from "../../services/grows/growRepository";
import { SQLiteStorage } from "../../services/storage/sqliteStorage";

import { Grow } from "../../types/Grow";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";

describe("GrowRepository", () => {
    it("creates a grow", async () => {
        const execute = jest.fn().mockResolvedValue(1);

        const storage = {
            execute,
            getAll: jest.fn(),
            getFirst: jest.fn(),
        } as unknown as SQLiteStorage;

        const repository = new GrowRepository(storage);
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
});