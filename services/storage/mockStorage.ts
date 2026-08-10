import { Storage } from "./storage";


export class MockStorage implements Storage {
    private data: Record<string, unknown[]> = {};
    constructor(initialData: Record<string, unknown[]> = {}) {
        this.data = initialData;
    }

    async getAll<T>(collection: string): Promise<T[]> {
        return(this.data[collection] ?? []) as T[];
    }

    async getById<T>(collection: string, id: string): Promise<T | undefined> {
        const items = await this.getAll<T>(collection);
        return items.find((item) => typeof item === "object" && item !== null && "id" in item && item.id === id);
    }

    async create<T>(collection: string, item: T): Promise<T> {
        if(!this.data[collection]) {
            this.data[collection] = [];
        }
        this.data[collection].push(item);
        return item;
    }

    async update<T>(collection: string, id: string, item: T): Promise<T | undefined> {
        const items = await this.getAll<T>(collection);
        const index = items.findIndex((existingItem) => typeof existingItem === "object" && existingItem !== null
            && "id" in existingItem && existingItem.id === id);
        if(index === -1)
            return undefined;
        items[index] = item;
        return item;
    }
}