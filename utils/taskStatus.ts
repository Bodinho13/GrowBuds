import { Task } from "../types/Task";
import { TaskStatus } from "../types/TaskStatus";

export function getTaskStatus(task: Task, now: Date) {
    const dueTime = task.dueDate.getTime();

    if(now.getTime() >= dueTime) {
        return TaskStatus.Overdue;
    }

    if(task.recurrence && task.lastCompletedAt) {
        const completedTime = task.lastCompletedAt.getTime();
        const timeToReopen = task.recurrence.timeToReopen ?? 70;

        const intervalInDays = task.recurrence.unit === "day" ?
            task.recurrence.interval : task.recurrence.interval * 7;
        const intervalInMs = intervalInDays * 24 * 60 * 60 * 1000;

        const reopenTime = completedTime + intervalInMs * (timeToReopen / 100);
        
        return now.getTime() >= reopenTime ? TaskStatus.Open : TaskStatus.Planned;
    }

    const leadTimeDays = task.leadTimeDays ?? 0;

    const openTime = dueTime - leadTimeDays * 24 * 60 * 60 * 1000;

    return now.getTime() >= openTime ? TaskStatus.Open : TaskStatus.Planned;
}