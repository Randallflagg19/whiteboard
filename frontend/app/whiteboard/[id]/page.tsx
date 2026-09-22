import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiNotFoundError, getBlock, getTasks } from "../../lib/api";
import { formatShortDate } from "../../lib/format";
import { DataError } from "../../ui/data-error";
import { TaskForm } from "./task-form";

const statusLabels = {
  AVAILABLE: "Доступно",
  WAITING: "Жду",
  SOMEDAY: "Когда-нибудь",
  DONE: "Готово",
} as const;

export default async function BlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let block;
  let tasks;
  try {
    [block, tasks] = await Promise.all([getBlock(id), getTasks(id)]);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    return <DataError />;
  }

  const done = tasks.filter((task) => task.status === "DONE").length;
  const progress = tasks.length ? (done / tasks.length) * 100 : 0;

  return (
    <div className="page-content detail-page">
      <header className="detail-header">
        <Link className="back-link" href="/whiteboard" aria-label="Назад к Whiteboard">‹</Link>
        <span className="detail-title">{block.title}</span>
        <span className="detail-emoji" aria-hidden="true">{block.emoji || "✦"}</span>
      </header>

      <section className="detail-summary" aria-label="Прогресс блока">
        <div className="progress-row">
          <span className="progress-track"><span className="progress-fill" style={{ width: `${progress}%` }} /></span>
          <strong>{done} / {tasks.length}</strong>
        </div>
        {block.dueDate && <p className="detail-due">до {formatShortDate(block.dueDate)}</p>}
      </section>

      <section className="tasks-section">
        <h2>Задачи</h2>
        {tasks.length === 0 ? (
          <div className="empty-tasks">В этом блоке пока нет задач.</div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className={`task-row ${task.status === "DONE" ? "task-row-done" : ""}`} key={task.id}>
                <span className="task-check" aria-hidden="true">{task.status === "DONE" ? "✓" : ""}</span>
                <div className="task-body">
                  <div className="task-title-line">
                    <span className="task-title">{task.title}</span>
                    {task.isPinned && <span className="task-pin" title="Закреплено">📌</span>}
                  </div>
                  <div className="task-meta">
                    {task.status !== "AVAILABLE" && <span className={`status status-${task.status.toLowerCase()}`}>{statusLabels[task.status]}</span>}
                    {task.scheduledFor && <span>на {formatShortDate(task.scheduledFor)}</span>}
                    {task.dueDate && <span>до {formatShortDate(task.dueDate)}</span>}
                    {task.isImportant && <span className="important-label">Важно</span>}
                  </div>
                  {task.note && <p className="task-note">{task.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <TaskForm blockId={id} />
    </div>
  );
}
