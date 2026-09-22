"use client";

import { useActionState, useRef } from "react";
import { captureTask } from "./actions";

export function CaptureForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (previous: { error: string }, data: FormData) => {
    const result = await captureTask(previous, data);
    if (!result.error) formRef.current?.reset();
    return result;
  }, { error: "" });

  return (
    <form ref={formRef} action={action} className="create-form inbox-capture-form">
      <label>Новая мысль<input name="title" required maxLength={200} placeholder="Что нужно запомнить?" autoComplete="off" /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Добавляем…" : "Добавить во входящие"}</button>
    </form>
  );
}
