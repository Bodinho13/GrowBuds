import { useCallback, useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";
import { Task } from "../types/Task";

export function useTasks() {
    const {taskService} = useServices();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = useCallback(async () => {
        setLoading(true);

        try {
            const [activeResult, archivedResult] = await Promise.all([
                taskService.getAll(),
                taskService.getArchived(),
            ]);
            setTasks(activeResult);
            setArchivedTasks(archivedResult);
        } finally {
            setLoading(false);
        }
    }, [taskService]);

    useEffect(() => {
        loadTasks();
    },[loadTasks]);

    return {
        tasks,
        archivedTasks,
        loading,
        refresh: loadTasks,
    };
}