import { useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";
import { Grow } from "../types/Grow";

export function useGrows() {
    const {growService} = useServices();

    const [grows, setGrows] = useState<Grow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGrows();
    }, []);

    async function loadGrows() {
        const result = await growService.getAll();
        setGrows(result);
        setLoading(false);
    }

    return {
        grows,
        loading,
        refresh: loadGrows,
    };
}