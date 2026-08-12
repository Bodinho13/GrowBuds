import { mockGrows } from "../../constants/mockData";
import { Grow } from "../../types/Grow";

export class MockGrowRepository {
    private grows: Grow[] = [...mockGrows];

    async getAll(): Promise<Grow[]> {
        return this.grows;
    }

    async getById(id: string): Promise<Grow | undefined> {
        return this.grows.find(grow => grow.id === id);
    }

    async create(grow: Grow): Promise<Grow> {
        this.grows.push(grow);
        return grow;
    }
}