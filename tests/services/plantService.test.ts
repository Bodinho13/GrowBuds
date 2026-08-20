import PlantService from "../../services/plants";
import { MockPlantRepository } from "../mocks/mockPlantRepository";
import type { CreatePlantDto } from "../../types/dto/CreatePlantDto";
import { Plant } from "../../types/Plant";
import { mockPlants } from "../../constants/mockData";

describe("PlantService", () => {
    let repository: MockPlantRepository;
    let plantService: PlantService;

    beforeEach(() => {
        repository = new MockPlantRepository();
        plantService = new PlantService(repository);
    });

    it("returns all plants", async () => {
        const plants = await plantService.getAll();
        expect(plants.length).toBeGreaterThan(0);
    });

    it("returns a plant by id", async () => {
        const plants = await plantService.getAll();
        const plant = await plantService.getById(plants[0].id);
        expect(plant).toBeDefined();
        expect(plant?.id).toBe(plants[0].id);
    });

    it("returns undefined for unknown plant id", async () => {
        const plant = await plantService.getById("invalid-id");
        expect(plant).toBeUndefined();
    });

    it("creates a plant", async () => {
        const dto: CreatePlantDto = {
            name: "test Plant",
            breeder: "tester",
        };
        const plant = await plantService.create(dto);

        expect(plant.name).toBe("test Plant");
        expect(plant.breeder).toBe("tester");
        expect(plant.id).toBeDefined();
        expect(plant.createdAt).toBeInstanceOf(Date);
        expect(plant.updatedAt).toBeInstanceOf(Date);
        expect(plant.isArchived).toBe(false);
    });

    it("updates a plant", async () => {
        const plant = await plantService.create({
            name: "original Plant",
            breeder: "Tester",
        });

        const updatedPlant = await plantService.update(
            plant.id,
            {
                name: "Updated Plant",
            }
        );

        expect(updatedPlant).toBeDefined();
        expect(updatedPlant?.id).toBe(plant.id);
        expect(updatedPlant?.name).toBe("Updated Plant");
        expect(updatedPlant?.breeder).toBe("Tester");
        expect(updatedPlant?.updatedAt).toBeInstanceOf(Date);
    });

    it("return undefined when updating a non-existing plant", async () => {
        const result = await plantService.update("does-not-exist", {name: "Updated Plant"});
        expect(result).toBeUndefined();
    });

    it("archives a plant", async () => {
        const oldUpdatedAt = new Date("2026-01-01");
        const plant: Plant = {
            ...mockPlants[0],
            isArchived: false,
            archivedAt: undefined,
            updatedAt: oldUpdatedAt,
        };

        repository.getById = jest.fn().mockResolvedValue(plant);
        repository.update = jest.fn().mockImplementation(
            async (updatedPlant: Plant) => updatedPlant
        );

        const archivedPlant = await plantService.archive(plant.id);

        expect(archivedPlant).toBeDefined();
        expect(archivedPlant?.id).toBe(plant.id);
        expect(archivedPlant?.isArchived).toBe(true);
        expect(archivedPlant?.archivedAt).toBeInstanceOf(Date);
        expect(archivedPlant?.updatedAt).not.toBe(oldUpdatedAt);

        expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it("returns undefined when archiving a non-existing plant", async () => {
        repository.getById = jest.fn().mockResolvedValue(undefined);
        repository.update = jest.fn();

        const result = await plantService.archive("does-not-exist");
        
        expect(result).toBeUndefined();
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("returns undefined when archiving a archived plant", async () => {
        const plant: Plant = {
            ...mockPlants[0],
            isArchived: true,
            archivedAt: new Date("2026-08-19"),
        };

        repository.getById = jest.fn().mockResolvedValue(plant);
        repository.update = jest.fn();
        
        const result = await plantService.archive(plant.id);

        expect(result).toBeUndefined();
        expect(repository.update).not.toHaveBeenCalled();
    });
});