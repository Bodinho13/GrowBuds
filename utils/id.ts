import { v4 as uuid } from "uuid";

export function createId(): string {
    return uuid();
}