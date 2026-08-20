import * as SQLite from "expo-sqlite";

import { PlantRepository } from "../../services/plants/plantRepository";
import { Plant } from "../../types/Plant";
import { createTablesSql } from "../../services/storage/databaseSchema";
import { SQLiteStorage } from "../../services/storage/sqliteStorage";
import { migrateDatabase } from "../../services/storage/migrations";
import { mockPlants } from "../../constants/mockData";
import { updatePlantSql } from "../../services/plants/plantSql";

describe("PlantRepository", () => {
    let storage: jest.Mocked<SQLiteStorage>;
    let repository: PlantRepository;

    beforeEach(() => {
        storage = {
            getAll: jest.fn(),
            getFirst: jest.fn(),
            execute: jest.fn(),
        } as unknown as jest.Mocked<SQLiteStorage>;
        repository = new PlantRepository(storage);
    });

    it("returns all plants", async () => {
        const rows = mockPlants;
        storage.getAll.mockResolvedValue(rows);
        const plants = await repository.getAll();
        expect(plants.length).toBeGreaterThan(0);
        expect(plants[0].id).toBe("plant-001");
    });

    it("return a plant by id", async () => {
        storage.getFirst.mockResolvedValue(mockPlants[0]);
        const plant = await repository.getById(mockPlants[0].id);
        expect(plant).toBeDefined();
        expect(plant?.id).toBe(mockPlants[0].id);
    });

    it("returns undefined for an unknown id", async () => {
        storage.getFirst.mockResolvedValue(undefined);
        const plant = await repository.getById("invalid-id");
        expect(plant).toBeUndefined();
    });

    it("creates a plant", async () => {
        const plant: Plant = {
            id: "test-plant-001",
            name: "Test Plant",
            breeder: "Tester",
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        };
        storage.execute.mockResolvedValue(1);

        const result = await repository.create(plant);

        expect(result).toEqual(plant);
        expect(storage.execute).toHaveBeenCalledTimes(1);
    });

    it("updates an existing plant", async () => {
        const plant: Plant = {
            id: "test-plant-update",
            name: "Original Plant",
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        };

        const updatedPlant: Plant = {
            ...plant,
            name: "Updated Plant",
            updatedAt: new Date()
        };
        storage.execute.mockResolvedValue(1);

        const result = await repository.update(updatedPlant);
        expect(result).toEqual(updatedPlant);
        expect(storage.execute).toHaveBeenCalledTimes(1);
    });

    it("return undefined when updating a non-existing plant", async () => {
        const plant: Plant = {
            id: "does-not-exist",
            name: "Unknown Plant",
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        };
        storage.execute.mockResolvedValue(0);

        const result = await repository.update(plant);
        expect(result).toBeUndefined();
    });

    it("archives an existing plant", async () => {
        const plant: Plant = {
            id: "test-plant-archive",
            name: "Archive Test Plant",
            createdAt: new Date("2026-08-01"),
            updatedAt: new Date("2026-08-01"),
            isArchived: false,
        };
        await repository.create(plant);

        const archivedPlant: Plant = {
            ...plant,
            archivedAt: new Date(),
            isArchived: true,
            updatedAt: new Date(),
        };
        storage.execute.mockResolvedValue(1);
        const result = await repository.update(archivedPlant);

        expect(result).toEqual(archivedPlant);
        expect(storage.execute).toHaveBeenCalledWith(updatePlantSql, [
            archivedPlant.name,
            null,
            null,
            null,
            null,
            archivedPlant.createdAt.toISOString(),
            archivedPlant.updatedAt.toISOString(),
            archivedPlant.archivedAt?.toISOString(),
            1,
            archivedPlant.id
        ]);
    });
});