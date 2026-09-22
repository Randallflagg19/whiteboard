"use client";

import { useActionState } from "react";
import { toggleTaskDone } from "./actions";

export function TaskCheck({ blockId, taskId, title, isDone }: {
  blockId: string;
  taskId: string;
  title: string;
  isDone: boolean;
}) {
  const [state, action, pending] = useActionState(
    toggleTaskDone.bind(null, blockId, taskId, isDone),
    { error: "" },
  );

  return (
    <form action={action} className="task-check-form">
      <button
        className="task-check"
        type="submit"
        disabled={pending}
        aria-label={`${isDone ? "Вернуть в доступные" : "Отметить выполненной"}: ${title}`}
        aria-pressed={isDone}
      >{isDone ? "✓" : ""}</button>
      {state.error && <span className="task-check-error" role="alert">{state.error}</span>}
    </form>
  );
}
