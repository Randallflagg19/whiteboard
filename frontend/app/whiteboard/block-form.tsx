"use client";

import { useActionState, useRef, useState } from "react";
import { createBlock } from "./actions";

export function BlockForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [dateType, setDateType] = useState("none");
  const [state, action, pending] = useActionState(async (previous: { error: string }, data: FormData) => {
    const result = await createBlock(previous, data);
    if (!result.error) {
      formRef.current?.reset();
      setDateType("none");
    }
    return result;
  }, { error: "" });

  return (
    <form ref={formRef} action={action} className="create-form">
      <h2>Новый блок</h2>
      <label>Название<input name="title" required maxLength={120} placeholder="Например, Виза" /></label>
      <div className="form-row">
        <label>Emoji <span>(необязательно)</span><input name="emoji" maxLength={12} placeholder="✈️" /></label>
        <label>Дата
          <select name="dateType" value={dateType} onChange={(event) => setDateType(event.target.value)}>
            <option value="none">Без даты</option>
            <option value="due">Сделать до</option>
            <option value="scheduled">На конкретный день</option>
            <option value="period">Период</option>
          </select>
        </label>
      </div>
      {(dateType === "due" || dateType === "scheduled") && <label>{dateType === "due" ? "Сделать до" : "На день"}<input name="date" type="date" required /></label>}
      {dateType === "period" && <div className="form-row form-period">
        <label>Начало<input name="periodStart" type="date" required /></label>
        <label>Конец<input name="periodEnd" type="date" required /></label>
      </div>}
      {dateType === "none" && <input type="hidden" name="date" value="" />}
      {dateType !== "period" && <><input type="hidden" name="periodStart" value="" /><input type="hidden" name="periodEnd" value="" /></>}
      {dateType === "period" && <input type="hidden" name="date" value="" />}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Создаём…" : "Создать блок"}</button>
    </form>
  );
}
