"use client";

import { useActionState } from "react";
import { markStreak } from "../actions";

export function StreakMark({ id, date, result }: { id: string; date: string; result: "SUCCESS" | "MISSED" | null }) {
  const [state, action, pending] = useActionState(markStreak.bind(null, id, date), { error: "" });

  return (
    <form action={action} className="streak-detail-mark">
      <button type="submit" name="result" value="SUCCESS" className={result === "SUCCESS" ? "streak-mark-success" : ""} aria-pressed={result === "SUCCESS"} disabled={pending}>✓ Сделано</button>
      <button type="submit" name="result" value="MISSED" className={result === "MISSED" ? "streak-mark-missed" : ""} aria-pressed={result === "MISSED"} disabled={pending}>✕ Пропущено</button>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
    </form>
  );
}
