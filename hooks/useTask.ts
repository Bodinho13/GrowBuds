import { useCallback, useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";
import { Task } from "../types/Task";

export function useTask(id?: string) {
    const {taskService} = useServices();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading]= useState(true);

    const loadTask = useCallback(async () => {
        if(!id) {
            setTask(null);
            return;
        }

        setLoading(true);

        const result = await taskService.getById(id);

        setTask(result ?? null);
        setLoading(false);
    }, [id, taskService]);

    useEffect(() => {
        loadTask();
    }, [loadTask]);

    return {
        task,
        loading,
        refresh: loadTask,
    };
}