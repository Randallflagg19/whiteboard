"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteRequest } from "../../lib/api";

export type DeleteBlockState = { error: string };

export async function deleteBlock(id: string, state: DeleteBlockState): Promise<DeleteBlockState> {
  if (!id) return { ...state, error: "Блок не найден." };

  try {
    await deleteRequest(`/blocks/${encodeURIComponent(id)}`);
  } catch {
    return { ...state, error: "Не удалось удалить блок. Попробуйте снова." };
  }

  revalidatePath("/whiteboard");
  revalidatePath("/today");
  revalidatePath("/inbox");
  redirect("/whiteboard");
}
