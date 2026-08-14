import { useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";
import { Grow } from "../types/Grow";

export function useGrow(id: string) {
    const {growService} = useServices();

    const [grow, setGrow] = useState<Grow | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGrow();
    },[id]);

    async function loadGrow() {
        setLoading(true);

        const result = await growService.getById(id);
        setGrow(result ?? null);
        setLoading(false);
    }

    return {
        grow,
        loading,
        refresh: loadGrow,
    }
}