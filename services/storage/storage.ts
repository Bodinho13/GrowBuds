export interface Storage {
    getAll<T>(collection: string): Promise<T[]>;
    getById<T>(collection: string, id: string): Promise<T | undefined>;
    create<T>(collection: string, item: T): Promise<T>;
    update<T>(collection:string, id: string, item: T): Promise<T | undefined>;
}