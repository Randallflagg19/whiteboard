"use client";

import { useState } from "react";
import { NoteForm } from "./note-form";
import { TaskForm } from "./task-form";

export function BlockComposer({ blockId }: { blockId: string }) {
  const [kind, setKind] = useState<"task" | "note">("task");

  return (
    <div className="create-form block-composer">
      <div className="composer-tabs" aria-label="Что добавить">
        <button type="button" className={kind === "task" ? "composer-tab-active" : ""} onClick={() => setKind("task")} aria-pressed={kind === "task"}>Задача</button>
        <button type="button" className={kind === "note" ? "composer-tab-active" : ""} onClick={() => setKind("note")} aria-pressed={kind === "note"}>Заметка</button>
      </div>
      {kind === "task" ? <TaskForm blockId={blockId} /> : <NoteForm blockId={blockId} />}
    </div>
  );
}
