"use client";

import { useActionState, useRef } from "react";
import { createStreak } from "./actions";

export function StreakForm({ onCreated }: { onCreated?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (previous: { error: string }, data: FormData) => {
    const result = await createStreak(previous, data);
    if (!result.error) {
      formRef.current?.reset();
      onCreated?.();
    }
    return result;
  }, { error: "" });

  return (
    <form ref={formRef} action={action} className="create-form streak-form">
      <h2>Новая привычка</h2>
      <label>Emoji<input name="emoji" required maxLength={12} placeholder="📚" /></label>
      <label>Название <span>(необязательно)</span><input name="title" maxLength={120} placeholder="Например, Читать" /></label>
      <label className="streak-show-title"><input name="showTitle" type="checkbox" defaultChecked />Показывать название</label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Создаём…" : "Добавить привычку"}</button>
    </form>
  );
}
