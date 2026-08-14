import { useCallback, useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";
import { Grow } from "../types/Grow";

export function useGrows() {
    const {growService} = useServices();

    const [grows, setGrows] = useState<Grow[]>([]);
    const [loading, setLoading] = useState(true);

    const loadGrows = useCallback(async () => {
        const result = await growService.getAll();
        setGrows(result);
        setLoading(false);
    }, [growService]);

    useEffect(() => {
        loadGrows();
    }, [loadGrows]);

    return {
        grows,
        loading,
        refresh: loadGrows,
    };
}