import { useEffect, useState } from "react";

import { useServices } from "../services/ServicesContext";

import type { Plant } from "../types/Plant";

export function usePlant(id: string) {
    const {plantService} = useServices();

    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlant();
    }, [id]);

    async function loadPlant() {
        setLoading(true);
        
        const result = await plantService.getById(id);

        setPlant(result ?? null);
        setLoading(false);
    }

    return {
        plant,
        loading,
        refresh: loadPlant,
    }
}