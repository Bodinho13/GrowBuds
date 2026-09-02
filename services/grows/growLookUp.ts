import { Grow } from "../../types/Grow";

export function createGrowNameLookup(grows: Grow[]): Record<string, string> {
    return Object.fromEntries(
        grows.map((grow) => [grow.id, grow.name])
    );
}