"use client";

import { useActionState } from "react";
import type { BoardBlock } from "../lib/api";
import { processTask } from "./actions";

export function ProcessForm({ taskId, blocks }: { taskId: string; blocks: BoardBlock[] }) {
  const [state, action, pending] = useActionState(processTask.bind(null, taskId), { error: "" });

  return (
    <form action={action} className="inbox-process-form">
      <label>
        Куда отправить
        <select name="blockId" defaultValue="">
          <option value="">Самостоятельная задача</option>
          {blocks.map((block) => <option value={block.id} key={block.id}>{block.title}</option>)}
        </select>
      </label>
      <button type="submit" disabled={pending}>{pending ? "Сохраняем…" : "Разобрать"}</button>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
    </form>
  );
}
