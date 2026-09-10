import GrowGroupService from "../../services/grow_groups/growGroupService";
import { GrowGroupRepository } from "../../services/grow_groups/types";
import { GrowGroup } from "../../types/GrowGroup";

describe("GrowGroupService", () => {
    let repository: jest.Mocked<GrowGroupRepository>;
    let growGroupService: GrowGroupService;

    const growGroup: GrowGroup = {
        id: "group-001",
        name: "Zelt 1",
        createdAt: new Date("2026-04-01"),
        updatedAt: new Date("2026-04-02"),
        archivedAt: undefined,
        isArchived: false,
    };

    beforeEach(() => {
        repository = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };

        growGroupService = new GrowGroupService(repository);
    });

    it("returns all grow groups", async () => {
        repository.getAll.mockResolvedValue([growGroup]);

        const result = await growGroupService.getAll();

        expect(result).toEqual([growGroup]);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    it("returns a grow group", async () => {
        repository.getById.mockResolvedValue(growGroup);

        const result = await growGroupService.getById("group-001");

        expect(result).toEqual(growGroup);
        expect(repository.getById).toHaveBeenCalledWith("group-001");
    });

    it("returns undefined when grow group does not exist", async () => {
        repository.getById.mockResolvedValue(undefined);

        const result = await growGroupService.getById("unknown");

        expect(result).toBeUndefined();
        expect(repository.getById).toHaveBeenCalledWith("unknown");
    });

    it("creates a grow group", async () => {
        repository.create.mockImplementation(
            async (growGroup) => growGroup
        );

        const result = await growGroupService.create({
            name: "Zelt 1",
        });

        expect(result.name).toBe("Zelt 1");
        expect(result.id).toEqual(expect.any(String));
        expect(result.createdAt).toEqual(expect.any(Date));
        expect(result.updatedAt).toEqual(expect.any(Date));
        expect(result.isArchived).toBe(false);
        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Zelt 1",
                isArchived: false,
            })
        );
    });

    it("updates a grow group", async () => {
        repository.getById.mockResolvedValue(growGroup);
        repository.update.mockImplementation(
            async (growGroup) => growGroup
        );

        const result = await growGroupService.update(
            "group-001",
            {
                name: "Zelt 2",
            }
        );

        expect(result).toEqual(
            expect.objectContaining({
                id: "group-001",
                name: "Zelt 2",
                isArchived: false,
            })
        );
        expect(repository.getById).toHaveBeenCalledWith("group-001");
        expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it("returns undefined when updating a grow group that does not exist", async () => {
        repository.getById.mockResolvedValue(undefined);

        const result = await growGroupService.update("unknown", {name: "Zelt 2"});

        expect(result).toBeUndefined();
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("archives a grow group", async () => {
        repository.getById.mockResolvedValue(growGroup);
        repository.update.mockImplementation(
            async (growGroup) => growGroup
        );

        const result = await growGroupService.archive("group-001");

        expect(result).toEqual(
            expect.objectContaining({
                id: "group-001",
                isArchived: true,
                archivedAt: expect.any(Date),
            })
        );
        expect(repository.getById).toHaveBeenCalledWith("group-001");
        expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it("returns undefined when grow group to archive does not exist", async () => {
        repository.getById.mockResolvedValue(undefined);

        const result = await growGroupService.archive("unknown");

        expect(result).toBeUndefined();
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("returns undefined when grow group is already archived", async () => {
        repository.getById.mockResolvedValue({
            ...growGroup,
            isArchived: true,
            archivedAt: new Date("2026-04-03"),
        });

        const result = await growGroupService.archive("group-001");

        expect(result).toBeUndefined();
        expect(repository.update).not.toHaveBeenCalled();
    });
});