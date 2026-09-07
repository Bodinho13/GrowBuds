import { GrowGroupRepository } from "../../services/grow_groups/growGroupRepository";
import { GrowGroupRow } from "../../services/grow_groups/types";
import { SQLiteStorage } from "../../services/storage/sqliteStorage";
import { GrowGroup } from "../../types/GrowGroup";

jest.mock("../../services/storage/sqliteStorage");

describe("GrowGroupRepository", () => {
    let repository: GrowGroupRepository;
    let storage: jest.Mocked<SQLiteStorage>;

    const growGroup: GrowGroup = {
        id: "group-001",
        name: "Zelt 1",
        createdAt: new Date("2026-04-01"),
        updatedAt: new Date("2026-04-02"),
        archivedAt: undefined,
        isArchived: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        storage = {
            getAll: jest.fn(),
            getFirst: jest.fn(),
            execute: jest.fn(),
        } as unknown as jest.Mocked<SQLiteStorage>;

        repository = new GrowGroupRepository(storage);
    });

    it("gets all grow groups", async () => {
        const rows: GrowGroupRow[] = [
            {
                id: "group-001",
                name: "Zelt 1",
                createdAt: "2026-04-01T00:00:00.000Z",
                updatedAt: "2026-04-02T00:00:00.000Z",
                archivedAt: null,
                isArchived: 0,
            },
        ];

        storage.getAll.mockResolvedValue(rows);

        const result = await repository.getAll();

        expect(result).toEqual([growGroup]);
        expect(storage.getAll).toHaveBeenCalledTimes(1);
    });

    it("get a grow group by id", async () => {
        const row: GrowGroupRow = {
            id: "group-001",
            name: "Zelt 1",
            createdAt: "2026-04-01T00:00:00.000Z",
            updatedAt: "2026-04-02T00:00:00.000Z",
            archivedAt: null,
            isArchived: 0,
        };

        storage.getFirst.mockResolvedValue(row);

        const result = await repository.getById("group-001");

        expect(result).toEqual(growGroup);
        expect(storage.getFirst).toHaveBeenCalledTimes(1);
        expect(storage.getFirst).toHaveBeenCalledWith(
            expect.stringContaining("WHERE id = ?"),
            ["group-001"]
        );
    });

    it("returns undefined when grow group does not exist", async () => {
        storage.getFirst.mockResolvedValue(undefined);

        const result = await repository.getById("unknown");

        expect(result).toBeUndefined();
    });

    it("creates a grow group", async () => {
        storage.execute.mockResolvedValue(1);

        const result = await repository.create(growGroup);

        expect(result).toEqual(growGroup);
        expect(storage.execute).toHaveBeenCalledTimes(1);
        expect(storage.execute).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO grow_groups"),
            [
                "group-001",
                "Zelt 1",
                "2026-04-01T00:00:00.000Z",
                "2026-04-02T00:00:00.000Z",
                null,
                0
            ]
        );
    });

    it("updates a grow group", async () => {
        storage.execute.mockResolvedValue(1);

        const result = await repository.update(growGroup);

        expect(result).toEqual(growGroup);
        expect(storage.execute).toHaveBeenCalledTimes(1);
        expect(storage.execute).toHaveBeenCalledWith(
            expect.stringContaining("UPDATE grow_groups"),
            [
                "Zelt 1",
                "2026-04-02T00:00:00.000Z",
                null,
                0,
                "group-001",
            ]
        );
    });
});