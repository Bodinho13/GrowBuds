import type { Grow } from "../../types/Grow";

import { mockGrows } from "../../constants/mockData";

class GrowService {
    
    async getGrows(): Promise<Grow[]> {
        return mockGrows;
    }

    async getGrow(id: string): Promise<Grow | undefined> {
        return mockGrows.find(grow => grow.id === id);
    }

}

export default new GrowService();