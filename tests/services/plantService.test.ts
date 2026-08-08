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
});