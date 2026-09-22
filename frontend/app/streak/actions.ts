"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteRequest, postJson, putJson, type Streak } from "../lib/api";

export type StreakActionState = { error: string };

export async function createStreak(_state: StreakActionState, formData: FormData): Promise<StreakActionState> {
  const emoji = formData.get("emoji");
  const title = formData.get("title");
  if (typeof emoji !== "string" || !emoji.trim()) return { error: "Выбери emoji." };
  if (typeof title !== "string") return { error: "Проверь название." };

  try {
    await postJson<Streak>("/streaks", {
      emoji: emoji.trim(),
      title: title.trim() || null,
      showTitle: formData.get("showTitle") === "on",
    });
  } catch {
    return { error: "Не удалось создать привычку. Попробуй ещё раз." };
  }
  revalidatePath("/streak");
  return { error: "" };
}

export async function markStreak(id: string, date: string, _state: StreakActionState, formData: FormData): Promise<StreakActionState> {
  const result = formData.get("result");
  if (result !== "SUCCESS" && result !== "MISSED") return { error: "Выбери результат." };
  try {
    await putJson(`/streaks/${encodeURIComponent(id)}/entries/${encodeURIComponent(date)}`, { result });
  } catch {
    return { error: "Не удалось сохранить отметку. Попробуй ещё раз." };
  }
  revalidatePath("/streak");
  revalidatePath(`/streak/${id}`);
  return { error: "" };
}

export async function deleteStreak(id: string, state: StreakActionState): Promise<StreakActionState> {
  try {
    await deleteRequest(`/streaks/${encodeURIComponent(id)}`);
  } catch {
    return { ...state, error: "Не удалось удалить привычку. Попробуй ещё раз." };
  }
  revalidatePath("/streak");
  redirect("/streak");
}
