"use client";

import { useState, useRef } from "react";
import { uploadFiles } from "@/lib/api";
import type { Upload } from "@/lib/types";
import { Upload as UploadIcon, Loader2 } from "lucide-react";

export default function UploadForm({
  memoryId,
  onUploaded,
}: {
  memoryId: string;
  onUploaded: (uploads: Upload[]) => void;
}) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files?.length) return;
    setError(null);
    setLoading(true);
    try {
      const list = Array.from(files);
      const result = await uploadFiles(memoryId, list);
      onUploaded(result);
      setFiles(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-surface rounded-2xl p-5 border space-y-4" style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}>
      <h3 className="font-semibold" style={{ color: "#F8FAFC" }}>
        Upload files
      </h3>
      <p className="text-sm" style={{ color: "#94A3B8" }}>
        PDF, images (JPEG/PNG/GIF/WebP), videos (MP4/WebM), or text (TXT/MD/CSV/JSON).
      </p>
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5" }}>
          {error}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.heic,.mp4,.webm,.mov,.avi,.txt,.md,.csv,.json"
        onChange={(e) => setFiles(e.target.files)}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#3B82F6]/20 file:text-[#3B82F6] text-slate-400"
      />
      {files?.length ? (
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          {files.length} file(s) selected
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading || !files?.length}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: "#3B82F6", color: "#FFFFFF" }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
        {loading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
