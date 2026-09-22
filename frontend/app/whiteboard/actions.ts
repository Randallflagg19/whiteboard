"use server";

import { revalidatePath } from "next/cache";
import { postJson, type BoardBlock } from "../lib/api";

export type FormState = { error: string };

export async function createBlock(_state: FormState, formData: FormData): Promise<FormState> {
  const title = formData.get("title");
  const emoji = formData.get("emoji");
  const dueDate = formData.get("dueDate");

  if (typeof title !== "string" || !title.trim()) return { error: "Введите название блока." };
  if (typeof emoji !== "string" || typeof dueDate !== "string") return { error: "Проверьте поля формы." };

  try {
    await postJson<BoardBlock>("/blocks", {
      title: title.trim(),
      ...(emoji.trim() && { emoji: emoji.trim() }),
      ...(dueDate && { dueDate }),
    });
  } catch {
    return { error: "Не удалось создать блок. Проверьте подключение и попробуйте снова." };
  }

  revalidatePath("/whiteboard");
  return { error: "" };
}
