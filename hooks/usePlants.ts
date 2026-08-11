import { useEffect, useState } from "react";

import { useServices } from "../services/ServicesContext";

import type { Plant } from "../types/Plant";

export function usePlants() {
    const { plantService } = useServices();

    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlants();
    }, []);

    async function loadPlants() {
        const result = await plantService.getAll();

        setPlants(result);
        setLoading(false);
    }

    return {
        plants,
        loading,
        refresh: loadPlants,
    };
}