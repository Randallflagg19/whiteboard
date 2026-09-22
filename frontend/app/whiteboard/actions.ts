"use server";

import { revalidatePath } from "next/cache";
import { postJson, type BoardBlock } from "../lib/api";

export type FormState = { error: string };

export async function createBlock(_state: FormState, formData: FormData): Promise<FormState> {
  const title = formData.get("title");
  const emoji = formData.get("emoji");
  const dateType = formData.get("dateType");
  const date = formData.get("date");
  const periodStart = formData.get("periodStart");
  const periodEnd = formData.get("periodEnd");

  if (typeof title !== "string" || !title.trim()) return { error: "Введите название блока." };
  if (typeof emoji !== "string" || typeof date !== "string" || typeof periodStart !== "string" || typeof periodEnd !== "string") return { error: "Проверьте поля формы." };
  if (!["none", "due", "scheduled", "period"].includes(String(dateType))) return { error: "Выберите тип даты." };
  if ((dateType === "due" || dateType === "scheduled") && !date) return { error: "Укажите дату блока." };
  if (dateType === "period" && (!periodStart || !periodEnd || periodStart > periodEnd)) return { error: "Проверьте даты периода." };

  try {
    await postJson<BoardBlock>("/blocks", {
      title: title.trim(),
      ...(emoji.trim() && { emoji: emoji.trim() }),
      ...(dateType === "due" && { dueDate: date }),
      ...(dateType === "scheduled" && { scheduledFor: date }),
      ...(dateType === "period" && { periodStart, periodEnd }),
    });
  } catch {
    return { error: "Не удалось создать блок. Проверьте подключение и попробуйте снова." };
  }

  revalidatePath("/whiteboard");
  return { error: "" };
}
