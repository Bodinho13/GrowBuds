import PlantService from "../../services/plants";

describe("PlantService", () => {
    it("returns all plants", async () => {
        const plants = await PlantService.getAll();
        expect(plants.length).toBeGreaterThan(0);
    });
});