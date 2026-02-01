"use client";

import { useState } from "react";
import { deleteUpload } from "@/lib/api";
import type { Upload } from "@/lib/types";
import { FileText, ExternalLink, Trash2, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function fileUrlHref(fileUrl: string): string {
  if (fileUrl.startsWith("http")) return fileUrl;
  return `${API_BASE}${fileUrl}`;
}

export default function UploadList({
  uploads,
  onDeleted,
}: {
  uploads: Upload[];
  onDeleted: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteUpload(id);
      onDeleted();
    } finally {
      setDeletingId(null);
    }
  }

  if (!uploads.length) {
    return (
      <div
        className="glass-surface rounded-2xl p-6 border text-center"
        style={{ borderColor: "rgba(148, 163, 184, 0.2)", color: "#94A3B8" }}
      >
        No files uploaded yet. Use the form above to add PDFs, images, or videos.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold" style={{ color: "#F8FAFC" }}>
        Files ({uploads.length})
      </h3>
      <ul className="space-y-2">
        {uploads.map((u) => (
          <li
            key={u.id}
            className="glass-surface rounded-xl p-4 border flex items-center justify-between gap-4"
            style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(59, 130, 246, 0.2)", color: "#3B82F6" }}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate" style={{ color: "#F8FAFC" }}>
                  {u.fileType} · {(u.fileSize / 1024).toFixed(1)} KB
                </p>
                <p className="text-xs truncate" style={{ color: "#64748B" }}>
                  {u.mimeType ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={fileUrlHref(u.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: "#94A3B8" }}
                title="Open file"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => handleDelete(u.id)}
                disabled={deletingId === u.id}
                className="p-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                style={{ color: "#F87171" }}
                title="Delete"
              >
                {deletingId === u.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
