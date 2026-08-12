import type { Grow } from "../../types/Grow";

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

}

export default GrowService;