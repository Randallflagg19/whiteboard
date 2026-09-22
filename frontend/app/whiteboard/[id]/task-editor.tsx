"use client";

import { useActionState, useRef, useState } from "react";
import type { Task } from "../../lib/api";
import { formatShortDate } from "../../lib/format";
import { deleteTask, updateTask } from "./actions";

const statusLabels = {
  AVAILABLE: "Доступно",
  WAITING: "Жду",
  SOMEDAY: "Когда-нибудь",
  DONE: "Готово",
} as const;

export function TaskEditor({ blockId, task }: { blockId: string; task: Task }) {
  const [open, setOpen] = useState(false);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(
    async (previous: { error: string; saved: boolean }, data: FormData) => {
      const result = await updateTask(blockId, task.id, previous, data);
      if (result.saved) setOpen(false);
      return result;
    },
    { error: "", saved: false },
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteTask.bind(null, blockId, task.id),
    { error: "" },
  );

  return (
    <div className="task-body">
      <div className="task-title-line">
        <button type="button" className="task-title task-title-button" onClick={() => setOpen(!open)} aria-expanded={open}>
          {task.title}
        </button>
        {task.isPinned && <span className="task-pin" title="Закреплено">📌</span>}
      </div>
      <div className="task-meta">
        {task.status !== "AVAILABLE" && <span className={`status status-${task.status.toLowerCase()}`}>{statusLabels[task.status]}</span>}
        {task.scheduledFor && <span>на {formatShortDate(task.scheduledFor)}</span>}
        {task.dueDate && <span>до {formatShortDate(task.dueDate)}</span>}
        {task.isImportant && <span className="important-label">Важно</span>}
      </div>
      {task.note && <p className="task-note">{task.note}</p>}

      {open && <>
        <form action={action} className="task-edit-form">
          <label>Название<input name="title" required maxLength={200} defaultValue={task.title} /></label>
          <label>Статус
            <select name="status" defaultValue={task.status}>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>Заметка<textarea name="note" rows={3} defaultValue={task.note ?? ""} /></label>
          <div className="task-edit-dates">
            <label>Доступно с<input name="availableFrom" type="date" defaultValue={task.availableFrom ?? ""} /></label>
            <label>На день<input name="scheduledFor" type="date" defaultValue={task.scheduledFor ?? ""} /></label>
            <label>Срок<input name="dueDate" type="date" defaultValue={task.dueDate ?? ""} /></label>
          </div>
          <div className="task-edit-flags">
            <label><input name="isImportant" type="checkbox" defaultChecked={task.isImportant} /> Важно</label>
            <label><input name="isPinned" type="checkbox" defaultChecked={task.isPinned} /> Закрепить</label>
          </div>
          {state.error && <p className="form-error" role="alert">{state.error}</p>}
          <div className="task-edit-actions">
            <button type="submit" disabled={pending}>{pending ? "Сохраняем…" : "Сохранить"}</button>
            <button type="button" className="secondary-button" onClick={() => setOpen(false)} disabled={pending}>Закрыть</button>
          </div>
        </form>
        <button type="button" className="task-delete-trigger" onClick={() => deleteDialog.current?.showModal()} disabled={pending}>
          Удалить задачу
        </button>
        <dialog
          ref={deleteDialog}
          className="delete-dialog"
          aria-labelledby={`delete-title-${task.id}`}
          onCancel={(event) => { if (deleting) event.preventDefault(); }}
        >
          <h2 id={`delete-title-${task.id}`}>Удалить задачу?</h2>
          <p>«{task.title}» будет удалена без возможности восстановления.</p>
          {deleteState.error && <p className="form-error" role="alert">{deleteState.error}</p>}
          <form action={deleteAction} className="delete-dialog-actions">
            <button type="button" className="secondary-button" onClick={() => deleteDialog.current?.close()} disabled={deleting}>Отмена</button>
            <button type="submit" className="danger-button" disabled={deleting}>{deleting ? "Удаляем…" : "Удалить"}</button>
          </form>
        </dialog>
      </>}
    </div>
  );
}
