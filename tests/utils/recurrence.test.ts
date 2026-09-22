import { getNextDueDate } from "../../utils/recurrence";

describe("getNextDueDate", () => {
    it("calculates the next due date for a day recurrence", () => {
        const lastCompletedAt = new Date("2026-09-07T10:00:00");

        const result = getNextDueDate(lastCompletedAt, {
            interval: 3,
            unit: "day",
            timeToReopen: 70,
        });

        expect(result).toEqual(new Date("2026-09-10T10:00:00"));
    });

    it("calculates the next due date for a week recurrence", () => {
        const lastCompletedAt = new Date("2026-09-07T10:00:00");

        const result = getNextDueDate(lastCompletedAt, {
            interval: 2,
            unit: "week",
            timeToReopen: 70,
        });

        expect(result).toEqual(new Date("2026-09-21T10:00:00"));
    });

    it("does not modify lastCompletedAt", () => {
        const lastCompletedAt = new Date("2026-09-07T10:00:00");
        const original = new Date(lastCompletedAt);

        getNextDueDate(lastCompletedAt, {
            interval: 3,
            unit: "day",
            timeToReopen: 70,
        });

        expect(lastCompletedAt).toEqual(original);
    })
});