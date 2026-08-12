import { CreateGrowDto } from "../../types/dto/CreateGrowDto";
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
}

export default GrowService;