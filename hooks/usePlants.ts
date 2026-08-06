import { useEffect, useState } from "react";

import PlantService from "../services/plants";

import type { Plant } from "../types/Plant";

export function usePlants() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlants();
    }, []);

    async function loadPlants() {
        const result = await PlantService.getPlants();

        setPlants(result);
        setLoading(false);
    }

    return {
        plants,
        loading,
        refresh: loadPlants,
    };
}