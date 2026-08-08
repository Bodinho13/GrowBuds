import { PlantRepository } from "../../services/plants/plantRepository";
import { Plant } from "../../types/Plant";

describe("PlantRepository", () => {
    const repository = new PlantRepository();

    it("returns all plants", async () => {
        const plants = await repository.getAll();
        expect(plants.length).toBeGreaterThan(0);
    });

    it("return a plant by id", async () => {
        const plants = await repository.getAll();
        const plant = await repository.getById(plants[0].id);
        expect(plant).toBeDefined();
        expect(plant?.id).toBe(plants[0].id);
    });

    it("returns undefined for an unknown id", async () => {
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

        const result = await repository.create(plant);
        expect(result).toEqual(plant);
    });

    it("can retrieve a created plant by id", async () => {
        const plant: Plant = {
            id: "test-plant-002",
            name: "Another Test Plant",
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        };

        await repository.create(plant);
        const result = await repository.getById(plant.id);
        expect(result).toEqual(plant);
    });

    it("updates an existing plant", async () => {
        const plant: Plant = {
            id: "test-plant-update",
            name: "Original Plant",
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        };

        await repository.create(plant);
        const updatedPlant: Plant = {
            ...plant,
            name: "Updated Plant",
            updatedAt: new Date()
        };

        const result = await repository.update(updatedPlant);
        expect(result).toEqual(updatedPlant);
        const storedPlant = await repository.getById(plant.id);
        expect(storedPlant).toEqual(updatedPlant);
    });

    it("return undefined when updating a non-existing plant", async () => {
        const plant: Plant = {
            id: "does-not-exist",
            name: "Unknown Plant",
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        };

        const result = await repository.update(plant);
        expect(result).toBeUndefined();
    });
});