
type Recurrence = {
    interval: number;
    unit: "day" | "week";
    timeToReopen: number;
}

export function getNextDueDate(lastCompletedAt: Date, recurrence: Recurrence): Date {
    const nextDueDate = new Date(lastCompletedAt);

    if(recurrence.unit === "day")
        nextDueDate.setDate(nextDueDate.getDate() + recurrence.interval);
    if(recurrence.unit === "week")
        nextDueDate.setDate(nextDueDate.getDate() + recurrence.interval * 7);

    return nextDueDate;
}