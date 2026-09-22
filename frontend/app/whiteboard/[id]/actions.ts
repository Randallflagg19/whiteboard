"use server";

import { revalidatePath } from "next/cache";
import { deleteRequest, patchJson, postJson, type Task } from "../../lib/api";
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

export async function toggleTaskDone(
  blockId: string | null,
  taskId: string,
  isDone: boolean,
  _state: FormState,
): Promise<FormState> {
  if (!taskId || typeof isDone !== "boolean") {
    return { ..._state, error: "Не удалось найти задачу." };
  }

  try {
    await patchJson<Task>(`/tasks/${encodeURIComponent(taskId)}`, {
      status: isDone ? "AVAILABLE" : "DONE",
    });
  } catch {
    return { ..._state, error: "Не удалось сохранить статус. Попробуйте снова." };
  }

  if (blockId) revalidatePath(`/whiteboard/${blockId}`);
  revalidatePath("/whiteboard");
  revalidatePath("/today");
  return { ..._state, error: "" };
}

export type EditTaskState = { error: string; saved: boolean };

export async function updateTask(
  blockId: string | null,
  taskId: string,
  state: EditTaskState,
  formData: FormData,
): Promise<EditTaskState> {
  const title = formData.get("title");
  const note = formData.get("note");
  const status = formData.get("status");
  const dateType = formData.get("dateType");
  const date = formData.get("date");
  const periodStart = formData.get("periodStart");
  const periodEnd = formData.get("periodEnd");

  if (!taskId || typeof title !== "string" || !title.trim()) {
    return { error: "Введите название задачи.", saved: false };
  }
  if (
    typeof note !== "string" ||
    typeof date !== "string" ||
    typeof periodStart !== "string" ||
    typeof periodEnd !== "string" ||
    !["none", "day", "period"].includes(String(dateType)) ||
    !["AVAILABLE", "WAITING", "SOMEDAY", "DONE"].includes(String(status))
  ) {
    return { error: "Проверьте поля задачи.", saved: false };
  }
  if (dateType === "day" && !date) return { ...state, error: "Укажите день задачи.", saved: false };
  if (dateType === "period" && (!periodStart || !periodEnd || periodStart > periodEnd)) {
    return { ...state, error: "Проверьте период задачи.", saved: false };
  }
  for (const value of dateType === "day" ? [date] : dateType === "period" ? [periodStart, periodEnd] : []) {
    const parsed = new Date(`${value}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
      return { ...state, error: "Проверьте даты задачи.", saved: false };
    }
  }

  try {
    await patchJson<Task>(`/tasks/${encodeURIComponent(taskId)}`, {
      title: title.trim(),
      note: note.trim() || null,
      status,
      scheduledFor: dateType === "day" ? date : null,
      periodStart: dateType === "period" ? periodStart : null,
      periodEnd: dateType === "period" ? periodEnd : null,
      isImportant: formData.get("isImportant") === "on",
      isPinned: formData.get("isPinned") === "on",
    });
  } catch {
    return { error: "Не удалось сохранить задачу. Попробуйте снова.", saved: false };
  }

  if (blockId) revalidatePath(`/whiteboard/${blockId}`);
  revalidatePath("/whiteboard");
  revalidatePath("/today");
  return { error: "", saved: true };
}

export async function deleteTask(blockId: string | null, taskId: string, state: FormState): Promise<FormState> {
  if (!taskId) return { ...state, error: "Не удалось найти задачу." };
  try {
    await deleteRequest(`/tasks/${encodeURIComponent(taskId)}`);
  } catch {
    return { ...state, error: "Не удалось удалить задачу. Попробуйте снова." };
  }

  if (blockId) revalidatePath(`/whiteboard/${blockId}`);
  revalidatePath("/whiteboard");
  revalidatePath("/today");
  return { ...state, error: "" };
}
