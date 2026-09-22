import { getBlocks, getInboxTasks } from "../lib/api";
import { DataError } from "../ui/data-error";
import { CaptureForm } from "./capture-form";
import { ProcessForm } from "./process-form";

export default async function InboxPage() {
  let tasks;
  let blocks;
  try {
    [tasks, blocks] = await Promise.all([getInboxTasks(), getBlocks()]);
  } catch {
    return <DataError />;
  }

  return (
    <div className="page-content">
      <header className="page-header"><h1>Входящие</h1></header>
      <CaptureForm />
      {tasks.length === 0 ? (
        <div className="empty-state inbox-empty">
          <h2>Входящие пусты</h2>
          <p>Добавь мысль сейчас, разберёшь её позже.</p>
        </div>
      ) : (
        <ul className="inbox-list">
          {tasks.map((task) => (
            <li className="inbox-item" key={task.id}>
              <h2>{task.title}</h2>
              {task.note && <p className="task-note">{task.note}</p>}
              <ProcessForm taskId={task.id} blocks={blocks} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
