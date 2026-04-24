/** API types matching backend schemas */

export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export type MemoryType = "pdf" | "image" | "video" | "text" | "webpage" | "youtube";
export type MemoryStatus = "processing" | "ready" | "failed";

export interface Memory {
  id: string;
  userId: string;
  type: MemoryType;
  title: string | null;
  summary: string | null;
  extractedText: string | null;
  sourceUrl: string | null;
  contentHash: string;
  category: string | null;
  status: MemoryStatus;
  createdAt: string;
  updatedAt: string;
  tags?: string[] | null;
}

export interface MemoryCreate {
  type: MemoryType;
  contentHash: string;
  title?: string | null;
  summary?: string | null;
  extractedText?: string | null;
  sourceUrl?: string | null;
  category?: string | null;
  status?: MemoryStatus;
}

export interface MemoryUpdate {
  title?: string | null;
  summary?: string | null;
  extractedText?: string | null;
  sourceUrl?: string | null;
  category?: string | null;
  status?: MemoryStatus;
}

export interface Upload {
  id: string;
  memoryId: string;
  fileUrl: string;
  fileType: string;
  mimeType: string | null;
  fileSize: number;
  createdAt: string;
}

export interface RelatedMemory extends Memory {
  similarity: number;
}
