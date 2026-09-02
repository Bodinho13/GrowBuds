import { useCallback, useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";
import { Task } from "../types/Task";

export function useTasks() {
    const {taskService} = useServices();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = useCallback(async () => {
        setLoading(true);

        try {
            const result = await taskService.getAll();
            setTasks(result);
        } finally {
            setLoading(false);
        }
    }, [taskService]);

    useEffect(() => {
        loadTasks();
    },[loadTasks]);

    return {
        tasks,
        loading,
        refresh: loadTasks,
    };
}