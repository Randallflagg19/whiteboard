"use server";

import { revalidatePath } from "next/cache";
import { deleteRequest, patchJson, postJson, type BlockNote } from "../../lib/api";

export type NoteState = { error: string; saved: boolean };

export async function createNote(blockId: string, _state: NoteState, formData: FormData): Promise<NoteState> {
  const content = formData.get("content");
  if (!blockId || typeof content !== "string" || !content.trim()) {
    return { error: "Напиши текст заметки.", saved: false };
  }
  try {
    await postJson<BlockNote>(`/blocks/${encodeURIComponent(blockId)}/notes`, { content: content.trim() });
  } catch {
    return { error: "Не удалось добавить заметку. Попробуйте снова.", saved: false };
  }
  revalidatePath(`/whiteboard/${blockId}`);
  return { error: "", saved: true };
}

export async function updateNote(blockId: string, noteId: string, _state: NoteState, formData: FormData): Promise<NoteState> {
  const content = formData.get("content");
  if (!blockId || !noteId || typeof content !== "string" || !content.trim()) {
    return { error: "Напиши текст заметки.", saved: false };
  }
  try {
    await patchJson<BlockNote>(`/blocks/${encodeURIComponent(blockId)}/notes/${encodeURIComponent(noteId)}`, { content: content.trim() });
  } catch {
    return { error: "Не удалось сохранить заметку. Попробуйте снова.", saved: false };
  }
  revalidatePath(`/whiteboard/${blockId}`);
  return { error: "", saved: true };
}

export async function deleteNote(blockId: string, noteId: string, state: NoteState): Promise<NoteState> {
  if (!blockId || !noteId) return { ...state, error: "Заметка не найдена.", saved: false };
  try {
    await deleteRequest(`/blocks/${encodeURIComponent(blockId)}/notes/${encodeURIComponent(noteId)}`);
  } catch {
    return { ...state, error: "Не удалось удалить заметку. Попробуйте снова.", saved: false };
  }
  revalidatePath(`/whiteboard/${blockId}`);
  return { error: "", saved: true };
}
