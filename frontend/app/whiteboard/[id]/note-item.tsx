"use client";

import { useActionState, useRef, useState } from "react";
import type { BlockNote } from "../../lib/api";
import { deleteNote, updateNote } from "./note-actions";

export function NoteItem({ blockId, note }: { blockId: string; note: BlockNote }) {
  const [editing, setEditing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [editState, editAction, saving] = useActionState(
    async (previous: { error: string; saved: boolean }, data: FormData) => {
      const result = await updateNote(blockId, note.id, previous, data);
      if (result.saved) setEditing(false);
      return result;
    },
    { error: "", saved: false },
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteNote.bind(null, blockId, note.id),
    { error: "", saved: false },
  );

  return (
    <li className="block-note">
      {editing ? (
        <form action={editAction} className="note-edit-form">
          <label>Текст<textarea name="content" required rows={4} defaultValue={note.content} /></label>
          {editState.error && <p className="form-error" role="alert">{editState.error}</p>}
          <div className="note-actions">
            <button type="submit" disabled={saving}>{saving ? "Сохраняем…" : "Сохранить"}</button>
            <button type="button" onClick={() => setEditing(false)} disabled={saving}>Отмена</button>
          </div>
        </form>
      ) : (
        <>
          <p>{note.content}</p>
          <div className="note-actions">
            <button type="button" onClick={() => setEditing(true)}>Изменить</button>
            <button type="button" className="note-delete-button" onClick={() => dialogRef.current?.showModal()}>Удалить</button>
          </div>
        </>
      )}
      <dialog ref={dialogRef} className="delete-dialog" aria-labelledby={`delete-note-title-${note.id}`} onCancel={(event) => { if (deleting) event.preventDefault(); }}>
        <h2 id={`delete-note-title-${note.id}`}>Удалить заметку?</h2>
        <p>Заметка будет удалена без возможности восстановления.</p>
        {deleteState.error && <p className="form-error" role="alert">{deleteState.error}</p>}
        <form action={deleteAction} className="delete-dialog-actions">
          <button type="button" onClick={() => dialogRef.current?.close()} disabled={deleting}>Отмена</button>
          <button type="submit" className="danger-button" disabled={deleting}>{deleting ? "Удаляем…" : "Удалить"}</button>
        </form>
      </dialog>
    </li>
  );
}
