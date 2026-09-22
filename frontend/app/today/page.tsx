import { getBlocks, getTasks } from "../lib/api";
import { isTaskForToday } from "../lib/today";
import { DataError } from "../ui/data-error";
import { TaskCheck } from "../whiteboard/[id]/task-check";
import { TaskEditor } from "../whiteboard/[id]/task-editor";

const timeZone = "Europe/Moscow";

export default async function TodayPage() {
  let tasks;
  let blocks;
  try {
    [tasks, blocks] = await Promise.all([getTasks(), getBlocks()]);
  } catch {
    return <DataError />;
  }

  const now = new Date();
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const dateLabel = new Intl.DateTimeFormat("ru-RU", { timeZone, day: "numeric", month: "long" }).format(now);
  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  const visible = tasks
    .filter((task) => isTaskForToday(task, task.blockId ? blocksById.get(task.blockId) : undefined, today))
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id));

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Сегодня</h1>
        <p className="today-date">{dateLabel}</p>
      </header>
      {visible.length === 0 ? (
        <div className="empty-state">
          <h2>На сегодня задач нет</h2>
          <p>Назначь день или период задаче либо её блоку.</p>
        </div>
      ) : (
        <ul className="task-list today-list">
          {visible.map((task) => (
            <li className="task-row" key={task.id}>
              <TaskCheck blockId={task.blockId} taskId={task.id} title={task.title} isDone={false} />
              <div className="today-task-content">
                {task.blockId && blocksById.has(task.blockId) && <span className="today-block-name">{blocksById.get(task.blockId)?.title}</span>}
                <TaskEditor blockId={task.blockId} task={task} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
