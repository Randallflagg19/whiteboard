import type { BoardBlock, Task } from "./api";

type Dates = Pick<Task, "scheduledFor" | "periodStart" | "periodEnd">;
type BlockDates = Pick<BoardBlock, "scheduledFor" | "periodStart" | "periodEnd" | "dueDate">;

function matchesDate(dates: Dates, today: string) {
  return dates.scheduledFor === today || (
    dates.periodStart !== null &&
    dates.periodEnd !== null &&
    dates.periodStart <= today &&
    today <= dates.periodEnd
  );
}

export function isTaskForToday(
  task: Dates & Pick<Task, "isInbox" | "status">,
  block: BlockDates | undefined,
  today: string,
) {
  if (task.isInbox || task.status === "DONE") return false;

  if (task.scheduledFor || task.periodStart || task.periodEnd) {
    return matchesDate(task, today);
  }

  return block ? matchesDate(block, today) || block.dueDate === today : false;
}
