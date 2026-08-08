import { createId } from "../../utils/id";

describe("createId", () => {
    it("returns a valid id", () => {
        const id = createId();

        expect(id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
    });

    it("returns unique UUIDs", () => {
        const firstId = createId();
        const secondId = createId();

        expect(firstId).not.toBe(secondId);
    });
});