"use client";

import { useState } from "react";
import type { Memory, MemoryCreate, MemoryUpdate } from "@/lib/types";

const TYPES = ["pdf", "image", "video", "text", "webpage", "youtube"] as const;
const STATUSES = ["processing", "ready", "failed"] as const;
const FILE_TYPES = ["pdf", "image", "video"] as const;

function generateContentHash(): string {
  return `hash-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function isFileType(t: Memory["type"]): t is (typeof FILE_TYPES)[number] {
  return FILE_TYPES.includes(t as (typeof FILE_TYPES)[number]);
}

type Props =
  | { mode: "create"; initial?: never; memoryId?: never; onSubmit: (body: MemoryCreate, files?: File[]) => Promise<void> }
  | { mode: "edit"; initial: Memory; memoryId: string; onSubmit: (body: MemoryUpdate) => Promise<void> };

export default function MemoryForm(props: Props) {
  const isCreate = props.mode === "create";
  const [type, setType] = useState<Memory["type"]>(isCreate ? "text" : props.initial.type);
  const [title, setTitle] = useState(isCreate ? "" : props.initial.title ?? "");
  const [summary, setSummary] = useState(isCreate ? "" : props.initial.summary ?? "");
  const [sourceUrl, setSourceUrl] = useState(isCreate ? "" : props.initial.sourceUrl ?? "");
  const [status, setStatus] = useState<Memory["status"]>(isCreate ? "processing" : props.initial.status);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showFileUpload = isCreate && isFileType(type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isCreate) {
        await props.onSubmit(
          {
            type,
            contentHash: generateContentHash(),
            title: title || null,
            summary: summary || null,
            sourceUrl: type === "webpage" || type === "youtube" ? (sourceUrl || null) : null,
            status: "processing",
          },
          files.length > 0 ? files : undefined
        );
      } else {
        await props.onSubmit({
          title: title || null,
          summary: summary || null,
          sourceUrl: type === "webpage" || type === "youtube" ? (sourceUrl || null) : null,
          status,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-surface rounded-2xl p-6 border space-y-4" style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}>
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5" }}>
          {error}
        </div>
      )}
      {isCreate && (
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>Type</label>
          <select
            value={type}
            onChange={(e) => {
              const t = e.target.value as Memory["type"];
              setType(t);
              if (t !== "webpage" && t !== "youtube") setSourceUrl("");
            }}
            className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white"
            style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
          >
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-slate-800 text-white">
                {t}
              </option>
            ))}
          </select>
        </div>
      )}
      {showFileUpload && (
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
            Upload {type} file(s)
          </label>
          <input
            type="file"
            multiple
            accept={
              type === "pdf"
                ? ".pdf"
                : type === "image"
                  ? ".jpg,.jpeg,.png,.gif,.webp,.heic"
                  : ".mp4,.webm,.mov,.avi"
            }
            onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#3B82F6]/20 file:text-[#3B82F6] text-slate-400"
          />
          {files.length > 0 && (
            <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
              {files.length} file(s) selected
            </p>
          )}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white placeholder:text-slate-500"
          style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
          placeholder="Optional title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white placeholder:text-slate-500 resize-none"
          style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
          placeholder="Optional summary"
        />
      </div>
      {(type === "webpage" || type === "youtube") && (
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>
            {type === "youtube" ? "YouTube video URL" : "Source URL"}
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white placeholder:text-slate-500"
            style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
            placeholder={type === "youtube" ? "https://www.youtube.com/watch?v=... or https://youtu.be/..." : "https://..."}
          />
        </div>
      )}
      {!isCreate && (
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Memory["status"])}
            className="w-full px-4 py-2 rounded-lg border bg-white/5 text-white"
            style={{ borderColor: "rgba(148, 163, 184, 0.3)" }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-slate-800 text-white">
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: "#3B82F6", color: "#FFFFFF" }}
      >
        {loading ? "Saving…" : isCreate ? "Create memory" : "Save changes"}
      </button>
    </form>
  );
}
