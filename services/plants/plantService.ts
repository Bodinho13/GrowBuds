import { PlantRepository } from "./plantRepository";

const repository = new PlantRepository();

class PlantService {
    
    async getAll() {
        return repository.getAll();
    }

    async getById(id: string) {
        return repository.getById(id);
    }

}

export default new PlantService();