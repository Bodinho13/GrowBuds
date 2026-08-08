import { PlantRepository } from "../../services/plants/plantRepository";

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
});