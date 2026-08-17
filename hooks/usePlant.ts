import { useCallback, useEffect, useState } from "react";

import { useServices } from "../services/ServicesContext";
import type { Plant } from "../types/Plant";

export function usePlant(id?: string) {
    const {plantService} = useServices();

    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);

    const loadPlant = useCallback(async () => {
        if(!id){
            setPlant(null);
            return;
        }

        setLoading(true);
        
        const result = await plantService.getById(id);

        setPlant(result ?? null);
        setLoading(false);
    }, [id, plantService]);

    useEffect(() => {
        loadPlant();
    }, [loadPlant]);

    return {
        plant,
        loading,
        refresh: loadPlant,
    };
}