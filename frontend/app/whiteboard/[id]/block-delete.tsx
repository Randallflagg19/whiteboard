"use client";

import { useActionState, useRef } from "react";
import { deleteBlock } from "./block-actions";

export function BlockDelete({ id, title, taskCount }: { id: string; title: string; taskCount: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(deleteBlock.bind(null, id), { error: "" });

  return (
    <section className="block-delete-section" aria-label="Удаление блока">
      <button type="button" className="task-delete-trigger" onClick={() => dialogRef.current?.showModal()}>
        Удалить блок
      </button>
      <dialog
        ref={dialogRef}
        className="delete-dialog"
        aria-labelledby="delete-block-title"
        onCancel={(event) => { if (pending) event.preventDefault(); }}
      >
        <h2 id="delete-block-title">Удалить блок?</h2>
        <p>Блок «{title}» будет удалён вместе с задачами ({taskCount}) и заметками. Это действие нельзя отменить.</p>
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
        <form action={action} className="delete-dialog-actions">
          <button type="button" className="secondary-button" onClick={() => dialogRef.current?.close()} disabled={pending}>Отмена</button>
          <button type="submit" className="danger-button" disabled={pending}>{pending ? "Удаляем…" : "Удалить блок"}</button>
        </form>
      </dialog>
    </section>
  );
}
