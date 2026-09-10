import { GrowGroup } from "../../types/GrowGroup";
import { createId } from "../../utils/id";
import { CreateGrowGroupDto, GrowGroupRepository, UpdateGrowGroupDto } from "./types";

class GrowGroupService {
    constructor(private readonly repository: GrowGroupRepository) {}

    async getAll() {
        return this.repository.getAll();
    }

    async getById(id: string) {
        return this.repository.getById(id);
    }

    async create(dto: CreateGrowGroupDto): Promise<GrowGroup> {
        const now = new Date();

        const growGroup: GrowGroup = {
            id: createId(),
            ...dto,
            createdAt: now,
            updatedAt: now,
            isArchived: false,
        };

        return this.repository.create(growGroup);
    }

    async update(id: string, dto: UpdateGrowGroupDto): Promise<GrowGroup | undefined> {
        const existingGG = await this.repository.getById(id);
        if(!existingGG)
            return undefined;

        const updatedGG: GrowGroup = {
            ...existingGG,
            ...dto,
            updatedAt: new Date(),
        };

        return this.repository.update(updatedGG);
    }

    async archive(id: string): Promise<GrowGroup | undefined> {
        const existingGG = await this.repository.getById(id);
        if(!existingGG || existingGG.isArchived)
            return undefined;

        const now = new Date();
        const archivedGG: GrowGroup = {
            ...existingGG,
            isArchived: true,
            archivedAt: now,
            updatedAt: now,
        };

        return this.repository.update(archivedGG);
    }
}

export default GrowGroupService;