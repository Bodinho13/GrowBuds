import PlantService from "../../services/plants";
import type { CreatePlantDto } from "../../types/dto/CreatePlantDto";

describe("PlantService", () => {

    it("returns all plants", async () => {
        const plants = await PlantService.getAll();
        expect(plants.length).toBeGreaterThan(0);
    });

    it("returns a plant by id", async () => {
        const plants = await PlantService.getAll();
        const plant = await PlantService.getById(plants[0].id);
        expect(plant).toBeDefined();
        expect(plant?.id).toBe(plants[0].id);
    });

    it("returns undefined for unknown plant id", async () => {
        const plant = await PlantService.getById("invalid-id");
        expect(plant).toBeUndefined();
    });

    it("creates a plant", async () => {
        const dto: CreatePlantDto = {
            name: "test Plant",
            breeder: "tester",
        };
        const plant = await PlantService.create(dto);

        expect(plant.name).toBe("test Plant");
        expect(plant.breeder).toBe("tester");
        expect(plant.id).toBeDefined();
        expect(plant.createdAt).toBeInstanceOf(Date);
        expect(plant.updatedAt).toBeInstanceOf(Date);
        expect(plant.isArchived).toBe(false);
    });

    it("updates a plant", async () => {
        const plant = await PlantService.create({
            name: "original Plant",
            breeder: "Tester",
        });

        const updatedPlant = await PlantService.update(
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
        const result = await PlantService.update("does-not-exist", {name: "Updated Plant"});
        expect(result).toBeUndefined();
    });

    it("archives a plant", async () => {
        const plant = await PlantService.create({name: "Plant to archive"});
        const archivedPlant = await PlantService.archive(plant.id);

        expect(archivedPlant).toBeDefined();
        expect(archivedPlant?.id).toBe(plant.id);
        expect(archivedPlant?.isArchived).toBe(true);
        expect(archivedPlant?.updatedAt).toBeInstanceOf(Date);
    });

    it("returns undefined when archiving a non-existing plant", async () => {
        const result = await PlantService.archive("does-not-exist");
        expect(result).toBeUndefined();
    });
});