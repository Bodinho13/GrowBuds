import { CreatePlantDto } from "../../types/dto/CreatePlantDto";
import { Plant } from "../../types/Plant";

import { createId } from "../../utils/id";

import { PlantRepository } from "./plantRepository";

const repository = new PlantRepository();

class PlantService {
    
    async getAll() {
        return repository.getAll();
    }

    async getById(id: string) {
        return repository.getById(id);
    }

    async create(dto: CreatePlantDto): Promise<Plant> {
        const now = new Date();

        const plant: Plant = {
            id: createId(),
            name: dto.name,
            strain: dto.strain,
            cross: dto.cross,
            breeder: dto.breeder,
            notes: dto.notes,
            createdAt: now,
            updatedAt: now,
            isArchived: false,
        };

        return repository.create(plant);
    }

}

export default new PlantService();