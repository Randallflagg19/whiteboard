"use server";

import { revalidatePath } from "next/cache";
import { patchJson, postJson, type Task } from "../lib/api";

export type InboxFormState = { error: string };

export async function captureTask(_state: InboxFormState, formData: FormData): Promise<InboxFormState> {
  const title = formData.get("title");
  if (typeof title !== "string" || !title.trim()) return { error: "Введите мысль или задачу." };

  try {
    await postJson<Task>("/tasks", { title: title.trim(), isInbox: true });
  } catch {
    return { error: "Не удалось добавить запись. Попробуйте снова." };
  }

  revalidatePath("/inbox");
  return { error: "" };
}

export async function processTask(
  taskId: string,
  state: InboxFormState,
  formData: FormData,
): Promise<InboxFormState> {
  const blockId = formData.get("blockId");
  if (!taskId || typeof blockId !== "string") return { ...state, error: "Проверьте выбранный блок." };

  try {
    await patchJson<Task>(`/tasks/${encodeURIComponent(taskId)}`, {
      isInbox: false,
      blockId: blockId || null,
    });
  } catch {
    return { ...state, error: "Не удалось разобрать запись. Попробуйте снова." };
  }

  revalidatePath("/inbox");
  revalidatePath("/whiteboard");
  revalidatePath("/today");
  return { ...state, error: "" };
}
