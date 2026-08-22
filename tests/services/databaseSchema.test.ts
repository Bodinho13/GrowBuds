import { createTablesSql } from "../../services/storage/databaseSchema";

describe("database schema", () => {
    it("contains the plants table", () => {
        expect(createTablesSql).toContain(
            "CREATE TABLE IF NOT EXISTS plants"
        );
    });

    it("contains the grow table", () => {
        expect(createTablesSql).toContain(
            "CREATE TABLE IF NOT EXISTS grows"
        );
    });

    it("contains the archivedAt column for plants", () => {
        expect(createTablesSql).toContain(
            "archivedAt TEXT"
        );
    });

    it("contains the endDate column for grows", () => {
        expect(createTablesSql).toContain(
            "endDate TEXT"
        );
    });

    it("defines the grow plant foreign key", () => {
        expect(createTablesSql).toContain(
            "FOREIGN KEY (plantId) REFERENCES plants(id)"
        );
    });

    it("uses the expected primary keys", () => {
        expect(createTablesSql).toContain(
            "id TEXT PRIMARY KEY NOT NULL"
        );
    });

    it("defaults plants to not archived", () => {
        expect(createTablesSql).toContain(
            "isArchived INTEGER NOT NULL DEFAULT 0"
        );
    });
});