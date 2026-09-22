"use client";

import { useActionState, useRef } from "react";
import { deleteStreak } from "./actions";

export function StreakDelete({ id, name }: { id: string; name: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(deleteStreak.bind(null, id), { error: "" });

  return (
    <>
      <button type="button" className="streak-delete-trigger" onClick={() => dialogRef.current?.showModal()}>Удалить привычку</button>
      <dialog ref={dialogRef} className="delete-dialog" aria-labelledby={`delete-streak-${id}`} onCancel={(event) => { if (pending) event.preventDefault(); }}>
        <h2 id={`delete-streak-${id}`}>Удалить привычку?</h2>
        <p>«{name}» и вся её история будут удалены без возможности восстановления.</p>
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
        <form action={action} className="delete-dialog-actions">
          <button type="button" onClick={() => dialogRef.current?.close()} disabled={pending}>Отмена</button>
          <button type="submit" className="danger-button" disabled={pending}>{pending ? "Удаляем…" : "Удалить"}</button>
        </form>
      </dialog>
    </>
  );
}
