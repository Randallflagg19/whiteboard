"use client";

import { useActionState, useRef } from "react";
import { createTask } from "./actions";

export function TaskForm({ blockId }: { blockId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (previous: { error: string }, data: FormData) => {
    const result = await createTask(blockId, previous, data);
    if (!result.error) formRef.current?.reset();
    return result;
  }, { error: "" });

  return (
    <form ref={formRef} action={action} className="composer-form task-form">
      <h2>Новая задача</h2>
      <label>Название<input name="title" required maxLength={200} placeholder="Что нужно сделать?" /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Добавляем…" : "Добавить задачу"}</button>
    </form>
  );
}
