import { CreateGrowDto } from "../../types/dto/CreateGrowDto";
import { UpdateGrowDto } from "../../types/dto/UpdateGrowDto";
import type { Grow } from "../../types/Grow";
import { createId } from "../../utils/id";

import { GrowRepository } from "./types";

class GrowService {
    constructor(
        private readonly repository: GrowRepository
    ) {}
    
    async getAll(): Promise<Grow[]> {
        return this.repository.getAll();
    }

    async getById(id: string): Promise<Grow | undefined> {
        return this.repository.getById(id);
    }

    async create(dto: CreateGrowDto): Promise<Grow> {
        const now = new Date();
        const grow: Grow = {
            id: createId(),
            plantId: dto.plantId,
            name: dto.name,
            startDate: dto.startDate,
            amount: dto.amount,
            stage: dto.stage,
            medium: dto.medium,
            location: dto.location,
            weight: undefined,
            createdAt: now,
            updatedAt: now,
            isArchived: false,
        };

        return this.repository.create(grow);
    }

    async update(id: string, dto: UpdateGrowDto): Promise<Grow | undefined> {
        const existingGrow = await this.repository.getById(id);
        if(!existingGrow)
            return undefined;

        const updatedGrow: Grow = {
            ...existingGrow,
            ...dto,
            updatedAt: new Date(),
        };
        return this.repository.update(updatedGrow);
    }

    async archive(id: string): Promise<Grow | undefined> {
        const existingGrow = await this.repository.getById(id);
        if(!existingGrow)
            return undefined;

        const now = new Date();

        const archivedGrow: Grow = {
            ...existingGrow,
            endDate: now,
            isArchived: true,
            updatedAt: now,
        };

        return this.repository.archive(archivedGrow);
    }
}

export default GrowService;