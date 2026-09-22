"use server";

import { revalidatePath } from "next/cache";
import { postJson, type Task } from "../../lib/api";
import type { FormState } from "../actions";

export async function createTask(blockId: string, _state: FormState, formData: FormData): Promise<FormState> {
  const title = formData.get("title");
  if (typeof title !== "string" || !title.trim()) return { error: "Введите название задачи." };
  if (!blockId) return { error: "Блок не найден." };

  try {
    await postJson<Task>("/tasks", { title: title.trim(), blockId });
  } catch {
    return { error: "Не удалось создать задачу. Попробуйте снова." };
  }

  revalidatePath(`/whiteboard/${blockId}`);
  revalidatePath("/whiteboard");
  return { error: "" };
}
