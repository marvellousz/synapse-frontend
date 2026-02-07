import { getAuthToken } from "./auth-token";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function api<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options ?? {};
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") url.searchParams.set(k, v);
    });
  }
  const hasBody = init.body != null;
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (hasBody && typeof init.body === "string") headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url.toString(), {
    ...init,
    headers,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === "string" ? err.detail : JSON.stringify(err));
  }
  return res.json() as Promise<T>;
}

/** Auth */
export async function login(email: string, password: string): Promise<{ access_token: string }> {
  return api<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(data: {
  email: string;
  password: string;
  name?: string | null;
}): Promise<import("./types").User> {
  return api<import("./types").User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<import("./types").User> {
  return api<import("./types").User>("/auth/me");
}

/** Memories */
export async function listMemories(params?: {
  type?: string;
  status?: string;
  skip?: number;
  take?: number;
}): Promise<Memory[]> {
  const search: Record<string, string> = {};
  if (params?.type) search.type = params.type;
  if (params?.status) search.status = params.status;
  if (params?.skip != null) search.skip = String(params.skip);
  if (params?.take != null) search.take = String(params.take);
  return api<Memory[]>("/memories", { params: search });
}

export async function getMemory(id: string): Promise<Memory> {
  return api<Memory>(`/memories/${id}`);
}

export async function createMemory(body: import("./types").MemoryCreate): Promise<Memory> {
  return api<Memory>("/memories", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateMemory(
  id: string,
  body: import("./types").MemoryUpdate
): Promise<Memory> {
  return api<Memory>(`/memories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteMemory(id: string): Promise<void> {
  return api<void>(`/memories/${id}`, { method: "DELETE" });
}

/** Trigger extraction pipeline (summary, tags, etc.) for a memory. Returns 202. */
export async function processMemory(id: string): Promise<{ message: string; memoryId: string }> {
  return api<{ message: string; memoryId: string }>(`/memories/${id}/process`, {
    method: "POST",
  });
}

/** Uploads */
export async function listUploads(memoryId: string): Promise<import("./types").Upload[]> {
  return api<import("./types").Upload[]>(`/memories/${memoryId}/uploads`);
}

export async function uploadFiles(
  memoryId: string,
  files: File[]
): Promise<import("./types").Upload[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/memories/${memoryId}/uploads`, {
    method: "POST",
    body: form,
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === "string" ? err.detail : JSON.stringify(err));
  }
  return res.json();
}

export async function deleteUpload(uploadId: string): Promise<void> {
  return api<void>(`/uploads/${uploadId}`, { method: "DELETE" });
}

/** Search */
export const searchAPI = {
  async semantic(
    query: string,
    options?: { limit?: number; contentType?: string }
  ): Promise<any[]> {
    return api<any[]>("/api/search/semantic", {
      method: "POST",
      body: JSON.stringify({
        query,
        limit: options?.limit ?? 10,
        contentType: options?.contentType,
      }),
    });
  },

  async keyword(
    keywords: string,
    options?: { limit?: number; contentType?: string }
  ): Promise<any[]> {
    return api<any[]>("/api/search/keyword", {
      method: "POST",
      body: JSON.stringify({
        keywords,
        limit: options?.limit ?? 10,
        contentType: options?.contentType,
      }),
    });
  },

  async hybrid(
    query: string,
    options?: { limit?: number; contentType?: string; semanticWeight?: number; keywordWeight?: number }
  ): Promise<any[]> {
    const searchParams = new URLSearchParams();
    if (options?.semanticWeight) searchParams.set("semantic_weight", String(options.semanticWeight));
    if (options?.keywordWeight) searchParams.set("keyword_weight", String(options.keywordWeight));

    return api<any[]>(`/api/search/hybrid${searchParams.toString() ? "?" + searchParams.toString() : ""}`, {
      method: "POST",
      body: JSON.stringify({
        query,
        limit: options?.limit ?? 10,
        contentType: options?.contentType,
      }),
    });
  },

  async getRelated(memoryId: string, limit?: number): Promise<any[]> {
    return api<any[]>(`/api/search/related/${memoryId}`, {
      params: limit ? { limit: String(limit) } : undefined,
    });
  },
};

/** Chat (RAG over memories) - legacy single-message endpoint */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendChatMessage(
  message: string,
  history?: ChatMessage[]
): Promise<{ reply: string }> {
  return api<{ reply: string }>("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      history: history ?? [],
    }),
  });
}

/** Chats (DB-backed history) */
export interface ChatListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageOut {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface ChatWithMessages {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageOut[];
}

export async function listChats(): Promise<ChatListItem[]> {
  return api<ChatListItem[]>("/api/chats");
}

export async function createChat(title?: string): Promise<ChatListItem> {
  return api<ChatListItem>("/api/chats", {
    method: "POST",
    body: JSON.stringify(title != null ? { title } : {}),
  });
}

export async function getChat(chatId: string): Promise<ChatWithMessages> {
  return api<ChatWithMessages>(`/api/chats/${chatId}`);
}

export async function sendChatMessageToChat(
  chatId: string,
  message: string
): Promise<{ reply: string; userMessageId: string; assistantMessageId: string }> {
  return api<{ reply: string; userMessageId: string; assistantMessageId: string }>(
    `/api/chats/${chatId}/messages`,
    { method: "POST", body: JSON.stringify({ message }) }
  );
}

export async function deleteChat(chatId: string): Promise<void> {
  return api<void>(`/api/chats/${chatId}`, { method: "DELETE" });
}

type Memory = import("./types").Memory;
