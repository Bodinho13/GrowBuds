import { SQLiteDatabase } from "expo-sqlite";
import { SQLiteStorage } from "../../services/storage/sqliteStorage";

describe("SQLiteStorage", () => {
    let db: jest.Mocked<SQLiteDatabase>;
    let storage: SQLiteStorage;

    beforeEach(() => {
        db = {
            getAllAsync: jest.fn(),
            getFirstAsync: jest.fn(),
            runAsync: jest.fn(),
        } as unknown as jest.Mocked<SQLiteDatabase>;

        storage = new SQLiteStorage(db);
    });

    it("returns all rows", async () => {
        const rows = [
            {id: "1", name: "Plant 1"},
            {id: "2", name: "Plant 2"},
        ];
        db.getAllAsync.mockResolvedValue(rows);
        const result = await storage.getAll("SELECT * FROM plants");

        expect(result).toEqual(rows);
        expect(db.getAllAsync).toHaveBeenCalledWith(
            "SELECT * FROM plants",
            [],
        );
    });

    it("passes parameters to getAllAsync", async () => {
        const rows = [{id: "plant-001", name: "Northern Lights"}];
        db.getAllAsync.mockResolvedValue(rows);

        const result = await storage.getAll(
            "SELECT * FROM plants WHERE id = ?",
            ["plant-001"],
        );

        expect(result).toEqual(rows);
        expect(db.getAllAsync).toHaveBeenCalledWith(
            "SELECT * FROM plants WHERE id = ?",
            ["plant-001"],
        );
    });

    it("returns the first row", async () => {
        const row = {
            id: "plant-001",
            name: "Northern Lights",
        };
        db.getFirstAsync.mockResolvedValue(row);

        const result = await storage.getFirst(
            "SELECT * FROM plants WHERE id = ?",
            ["plant-001"],
        );

        expect(result).toEqual(row);
        expect(db.getFirstAsync).toHaveBeenCalledWith(
            "SELECT * FROM plants WHERE id = ?",
            ["plant-001"],
        );
    });

    it("returns undefined when no row exists", async () => {
        db.getFirstAsync.mockResolvedValue(null);

        const result = await storage.getFirst(
            "SELECT * FROM plants WHERE id = ?",
            ["does-not-exist"],
        );

        expect(result).toBeUndefined();
    });

    it("executes a statement and returns the number of changes", async () => {
        db.runAsync.mockResolvedValue({
            changes: 1,
        } as Awaited<ReturnType<SQLiteDatabase["runAsync"]>>);

        const result = await storage.execute(
            "UPDATE plants SET name = ? WHERE id = ?",
            ["Updated Plant", "plant-001"],
        );

        expect(result).toBe(1);
        expect(db.runAsync).toHaveBeenCalledWith(
            "UPDATE plants SET name = ? WHERE id = ?",
            ["Updated Plant", "plant-001"],
        );
    });

    it("returns zero when no rows were changed", async () => {
        db.runAsync.mockResolvedValue({
            changes: 0,
        } as Awaited<ReturnType<SQLiteDatabase["runAsync"]>>);

        const result = await storage.execute(
            "UPDATE plants SET name = ? WHERE id = ?",
            ["Updated Plant", "does-not-exist"],
        );

        expect(result).toBe(0);
    });
});