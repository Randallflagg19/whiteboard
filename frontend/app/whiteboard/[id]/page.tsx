import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiNotFoundError, getBlock, getTasks } from "../../lib/api";
import { formatBlockDate } from "../../lib/format";
import { DataError } from "../../ui/data-error";
import { TaskForm } from "./task-form";
import { TaskCheck } from "./task-check";
import { TaskEditor } from "./task-editor";
import { BlockDelete } from "./block-delete";

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
  const blockDate = formatBlockDate(block);

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
        {blockDate && <p className={blockDate.isDeadline ? "detail-due" : "detail-date"}>{blockDate.text}</p>}
      </section>

      <section className="tasks-section">
        <h2>Задачи</h2>
        {tasks.length === 0 ? (
          <div className="empty-tasks">В этом блоке пока нет задач.</div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className={`task-row ${task.status === "DONE" ? "task-row-done" : ""}`} key={task.id}>
                <TaskCheck blockId={id} taskId={task.id} title={task.title} isDone={task.status === "DONE"} />
                <TaskEditor blockId={id} task={task} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <TaskForm blockId={id} />
      <BlockDelete id={id} title={block.title} taskCount={tasks.length} />
    </div>
  );
}
