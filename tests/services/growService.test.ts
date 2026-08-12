import GrowService from "../../services/grows";
import { MockGrowRepository } from "../mocks/mockGrowRepository";

describe("GrowService", () => {
    let repository: MockGrowRepository;
    let growService: GrowService;

    beforeEach(() => {
        repository = new MockGrowRepository();
        growService = new GrowService(repository);
    });

    it("return all grows", async () => {
        const grows = await growService.getAll();
        expect(grows.length).toBeGreaterThan(0);
    });

    it("returns a grow by id", async () => {
        const grows = await growService.getAll();
        const grow = await growService.getById(grows[0].id);

        expect(grow).toBeDefined();
        expect(grow?.id).toBe(grows[0].id);
    });

    it("returns undefined for unknown grow id", async () => {
        const grow = await growService.getById("invalid-id");
        expect(grow).toBeUndefined();
    });
});