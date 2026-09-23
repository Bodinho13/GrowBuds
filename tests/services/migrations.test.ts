import { SQLiteDatabase } from "expo-sqlite";
import { migrateDatabase } from "../../services/storage/migrations";

describe("migrateDatabase", () => {
    let db: jest.Mocked<SQLiteDatabase>;

    beforeEach(() => {
        db = {
            getFirstAsync: jest.fn(),
            execAsync: jest.fn(),
        } as unknown as jest.Mocked<SQLiteDatabase>;
    });

    it("migrates a new database to version 5", async () => {
        db.getFirstAsync.mockResolvedValue({ user_version: 0 });
        await migrateDatabase(db);

        expect(db.getFirstAsync).toHaveBeenCalledWith("PRAGMA user_version;");
        expect(db.execAsync).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining("PRAGMA user_version = 1"),
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining(
                "ALTER TABLE plants",
            ),
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining(
                "ADD COLUMN archivedAt TEXT",
            ),
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            3,
            expect.stringContaining("PRAGMA user_version = 2"),
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            4,
            expect.stringContaining("ADD COLUMN growGroupId TEXT;"),
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            5,
            expect.stringContaining("PRAGMA user_version = 3"),
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            6,
            expect.stringContaining("ALTER TABLE tasks")
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            6,
            expect.stringContaining("ADD COLUMN lastCompletedAt TEXT")
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            7,
            expect.stringContaining("PRAGMA user_version = 4")
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            8,
            expect.stringContaining("ADD COLUMN timeToReopen INTEGER")
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            9,
            expect.stringContaining("ADD COLUMN leadTimeDays INTEGER")
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            10,
            expect.stringContaining("PRAGMA user_version = 5")
        );
    });

    it("migrates a version 4 database to version 4", async () => {
        db.getFirstAsync.mockResolvedValue({
            user_version: 4,
        });
        await migrateDatabase(db);

        expect(db.execAsync).toHaveBeenCalledTimes(3);
        expect(db.execAsync).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining("ADD COLUMN timeToReopen INTEGER")
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining("ADD COLUMN leadTimeDays INTEGER")
        );
        expect(db.execAsync).toHaveBeenNthCalledWith(
            3,
            expect.stringContaining("PRAGMA user_version = 5")
        );
    });

    it("does nothing when database is already at version 5", async () => {
        db.getFirstAsync.mockResolvedValue({
            user_version: 5,
        });
        await migrateDatabase(db);

        expect(db.execAsync).not.toHaveBeenCalled();
    });

    it("treats a missing user_version as version 0", async () => {
        db.getFirstAsync.mockResolvedValue(null);
        await migrateDatabase(db);

        expect(db.execAsync).toHaveBeenCalledTimes(10);
    });
});
