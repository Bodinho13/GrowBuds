import { CreatePlantDto } from "../../types/dto/CreatePlantDto";
import { UpdatePlantDto } from "../../types/dto/UpdatePlantDto";
import { Plant } from "../../types/Plant";

import { createId } from "../../utils/id";

import { PlantRepository } from "./plantRepository";
import { PlantId } from "./types";

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

    async update(id: PlantId, dto: UpdatePlantDto): Promise<Plant | undefined> {
        const existingPlant = await repository.getById(id);
        if(!existingPlant)
            return undefined;

        const updatedPlant: Plant = {
            ...existingPlant,
            ...dto,
            updatedAt: new Date(),
        };
        return repository.update(updatedPlant);
    }

    async archive(id: string): Promise<Plant | undefined> {
        const existingPlant = await repository.getById(id);
        if(!existingPlant)
            return undefined;

        const archivedPlant: Plant = {
            ...existingPlant,
            isArchived: true,
            updatedAt: new Date()
        };
        return repository.update(archivedPlant);
    }

}

export default new PlantService();