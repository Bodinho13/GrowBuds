import { useEffect, useState } from "react";

import PlantService from "../services/plants";

import type { Plant } from "../types/Plant";

export function usePlant(id: string) {
    const [plant, setPlant] = useState<Plant>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlant();
    }, [id]);

    async function loadPlant() {
        const result = await PlantService.getById(id);

        setPlant(result);
        setLoading(false);
    }

    return {
        plant,
        loading,
        refresh: loadPlant,
    }
}