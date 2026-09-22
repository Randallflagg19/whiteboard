"use client";

import { useActionState, useRef } from "react";
import { createBlock } from "./actions";

export function BlockForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (previous: { error: string }, data: FormData) => {
    const result = await createBlock(previous, data);
    if (!result.error) formRef.current?.reset();
    return result;
  }, { error: "" });

  return (
    <form ref={formRef} action={action} className="create-form">
      <h2>Новый блок</h2>
      <label>Название<input name="title" required maxLength={120} placeholder="Например, Виза" /></label>
      <div className="form-row">
        <label>Emoji <span>(необязательно)</span><input name="emoji" maxLength={12} placeholder="✈️" /></label>
        <label>Срок <span>(необязательно)</span><input name="dueDate" type="date" /></label>
      </div>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Создаём…" : "Создать блок"}</button>
    </form>
  );
}
