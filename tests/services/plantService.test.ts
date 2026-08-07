import PlantService from "../../services/plants";

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
});