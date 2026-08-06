import type { Measurement } from "../../types/Measurement";

//import { mockPlants } from "../../constants/mockData";

class MeasurementService {
    
    async getMeasurements(): Promise<Measurement[]> {
        return [];
    }

    async getMeasurement(id: string): Promise<Measurement | undefined> {
        //return mockPlants.find(plant => plant.id === id);
        return undefined;
    }

}

export default new MeasurementService();