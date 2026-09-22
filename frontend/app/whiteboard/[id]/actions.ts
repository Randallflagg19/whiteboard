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
  blockId: string,
  taskId: string,
  isDone: boolean,
  _state: FormState,
): Promise<FormState> {
  if (!blockId || !taskId || typeof isDone !== "boolean") {
    return { ..._state, error: "Не удалось найти задачу." };
  }

  try {
    await patchJson<Task>(`/tasks/${encodeURIComponent(taskId)}`, {
      status: isDone ? "AVAILABLE" : "DONE",
    });
  } catch {
    return { ..._state, error: "Не удалось сохранить статус. Попробуйте снова." };
  }

  revalidatePath(`/whiteboard/${blockId}`);
  revalidatePath("/whiteboard");
  return { ..._state, error: "" };
}

export type EditTaskState = { error: string; saved: boolean };

export async function updateTask(
  blockId: string,
  taskId: string,
  state: EditTaskState,
  formData: FormData,
): Promise<EditTaskState> {
  const title = formData.get("title");
  const note = formData.get("note");
  const status = formData.get("status");
  const availableFrom = formData.get("availableFrom");
  const scheduledFor = formData.get("scheduledFor");
  const dueDate = formData.get("dueDate");

  if (!blockId || !taskId || typeof title !== "string" || !title.trim()) {
    return { error: "Введите название задачи.", saved: false };
  }
  if (
    typeof note !== "string" ||
    typeof availableFrom !== "string" ||
    typeof scheduledFor !== "string" ||
    typeof dueDate !== "string" ||
    !["AVAILABLE", "WAITING", "SOMEDAY", "DONE"].includes(String(status))
  ) {
    return { error: "Проверьте поля задачи.", saved: false };
  }
  for (const date of [availableFrom, scheduledFor, dueDate]) {
    if (!date) continue;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      return { ...state, error: "Проверьте даты задачи.", saved: false };
    }
  }

  try {
    await patchJson<Task>(`/tasks/${encodeURIComponent(taskId)}`, {
      title: title.trim(),
      note: note.trim() || null,
      status,
      availableFrom: availableFrom || null,
      scheduledFor: scheduledFor || null,
      dueDate: dueDate || null,
      isImportant: formData.get("isImportant") === "on",
      isPinned: formData.get("isPinned") === "on",
    });
  } catch {
    return { error: "Не удалось сохранить задачу. Попробуйте снова.", saved: false };
  }

  revalidatePath(`/whiteboard/${blockId}`);
  revalidatePath("/whiteboard");
  return { error: "", saved: true };
}

export async function deleteTask(blockId: string, taskId: string, state: FormState): Promise<FormState> {
  if (!blockId || !taskId) return { ...state, error: "Не удалось найти задачу." };
  try {
    await deleteRequest(`/tasks/${encodeURIComponent(taskId)}`);
  } catch {
    return { ...state, error: "Не удалось удалить задачу. Попробуйте снова." };
  }

  revalidatePath(`/whiteboard/${blockId}`);
  revalidatePath("/whiteboard");
  return { ...state, error: "" };
}
