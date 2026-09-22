"use client";

import { useActionState, useRef } from "react";
import { createNote } from "./note-actions";

export function NoteForm({ blockId }: { blockId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (previous: { error: string; saved: boolean }, data: FormData) => {
    const result = await createNote(blockId, previous, data);
    if (result.saved) formRef.current?.reset();
    return result;
  }, { error: "", saved: false });

  return (
    <form ref={formRef} action={action} className="composer-form">
      <h2>Новая заметка</h2>
      <label>Текст<textarea name="content" required rows={4} placeholder="Ссылка, адрес или важная информация" /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Добавляем…" : "Добавить заметку"}</button>
    </form>
  );
}
