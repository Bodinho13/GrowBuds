import { GrowRepository } from "../../services/grows/growRepository";
import { getGrowsByGrowGroupId, updateGrowSql } from "../../services/grows/growSql";
import { GrowRow } from "../../services/grows/types";
import { SQLiteStorage } from "../../services/storage/sqliteStorage";

import { Grow } from "../../types/Grow";
import { GrowMedium } from "../../types/GrowMedium";
import { GrowStage } from "../../types/GrowStage";

describe("GrowRepository", () => {
    let repository: GrowRepository;
    let storage: jest.Mocked<SQLiteStorage>;

    beforeEach(() => {
        jest.clearAllMocks();

        storage = {
            execute: jest.fn(),
            getAll: jest.fn(),
            getFirst: jest.fn(),
        } as unknown as jest.Mocked<SQLiteStorage>;

        repository = new GrowRepository(storage);
    });

    it("returns all grows belonging to a grow group", async () => {
        const rows: GrowRow[] = [
            {
                id: "grow-001",
                plantId: "plant-001",
                growGroupId: "group-001",
                name: "Northern Lights",
                startDate: "2026-04-01T00:00:00.000Z",
                endDate: null,
                amount: 1,
                stage: GrowStage.Vegetative,
                medium: GrowMedium.Soil,
                location: null,
                weight: null,
                createdAt: "2026-04-02T00:00:00.000Z",
                updatedAt: "2026-04-03T00:00:00.000Z",
                isArchived: 0,
            },
            {
                id: "grow-002",
                plantId: "plant-002",
                growGroupId: "group-001",
                name: "Blueberry",
                startDate: "2026-04-04T00:00:00.000Z",
                endDate: null,
                amount: 2,
                stage: GrowStage.Vegetative,
                medium: GrowMedium.Soil,
                location: null,
                weight: null,
                createdAt: "2026-04-05T00:00:00.000Z",
                updatedAt: "2026-04-06T00:00:00.000Z",
                isArchived: 0,
            },
        ];
        storage.getAll.mockResolvedValue(rows);

        const result = await repository.getByGrowGroupId("group-001");

        expect(storage.getAll).toHaveBeenCalledWith(
            getGrowsByGrowGroupId,
            ["group-001"]
        );
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe("grow-001");
        expect(result[1].id).toBe("grow-002");
        expect(result[0].growGroupId).toBe("group-001");
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
        expect(storage.execute).toHaveBeenCalledTimes(1);
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
        storage.execute.mockResolvedValue(1);

        const result = await repository.update(grow);

        expect(result).toEqual(grow);
        expect(storage.execute).toHaveBeenCalledTimes(1);
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
        storage.execute.mockResolvedValue(1);

        const result = await repository.update(grow);

        expect(result).toEqual(grow);
        expect(storage.execute).toHaveBeenCalledTimes(1);
        expect(storage.execute).toHaveBeenCalledWith(updateGrowSql, [
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