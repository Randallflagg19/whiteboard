const apiUrl = process.env.API_URL ?? "http://127.0.0.1:3001";

export type BoardBlock = {
  id: string;
  title: string;
  emoji: string | null;
  dueDate: string | null;
  scheduledFor: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  sortOrder: number;
};

export type Task = {
  id: string;
  title: string;
  note: string | null;
  status: "AVAILABLE" | "WAITING" | "SOMEDAY" | "DONE";
  isInbox: boolean;
  isImportant: boolean;
  isPinned: boolean;
  availableFrom: string | null;
  scheduledFor: string | null;
  dueDate: string | null;
  blockId: string | null;
};

export class ApiNotFoundError extends Error {}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, { cache: "no-store" });
  if (response.status === 404) throw new ApiNotFoundError();
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return (await response.json()) as T;
}

export async function postJson<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return (await response.json()) as T;
}

export async function patchJson<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return (await response.json()) as T;
}

export async function deleteRequest(path: string): Promise<void> {
  const response = await fetch(`${apiUrl}${path}`, { method: "DELETE", cache: "no-store" });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
}

export function getBlocks() {
  return getJson<BoardBlock[]>("/blocks");
}

export function getBlock(id: string) {
  return getJson<BoardBlock>(`/blocks/${encodeURIComponent(id)}`);
}

export function getTasks(blockId?: string) {
  const query = blockId ? `?blockId=${encodeURIComponent(blockId)}` : "";
  return getJson<Task[]>(`/tasks${query}`);
}
