import { useCallback, useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";
import { GrowGroup } from "../types/GrowGroup";

export function useGrowGroups() {
    const {growGroupService} = useServices();

    const [growGroups, setGrowGroups] = useState<GrowGroup[]>([]);
    const [loading, setLoading] = useState(true);

    const loadGrowGroups = useCallback(async () => {
        setLoading(true);

        try {
            const result = await growGroupService.getAll();
            setGrowGroups(result);
        } finally {
            setLoading(false);
        }
    }, [growGroupService]);

    useEffect(() => {
        loadGrowGroups();
    }, [loadGrowGroups]);

    return {
        growGroups,
        loading,
        refresh: loadGrowGroups,
    };
}