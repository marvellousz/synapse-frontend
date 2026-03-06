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
      <div className="brut-card p-8 bg-gray-50 border-gray-200 shadow-none text-center">
        <p className="font-bold text-gray-400 uppercase text-xs tracking-widest leading-loose">
          NO DATA STREAMS ATTACHED. <br />
          USE THE INTERFACE ABOVE TO SYNC ASSETS.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-black uppercase text-[10px] tracking-widest text-gray-500 mb-4">
        ATTACHED ASSETS ({uploads.length})
      </h3>
      <ul className="grid gap-3">
        {uploads.map((u) => (
          <li
            key={u.id}
            className="bg-white border-4 border-black p-4 flex items-center justify-between gap-4 shadow-[4px_4px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 border-2 border-black flex items-center justify-center rotate-[-3deg]">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="font-black uppercase text-xs truncate text-black">
                  {u.fileType} · {(u.fileSize / 1024).toFixed(1)} KB
                </p>
                <p className="font-bold text-[10px] uppercase text-gray-400 truncate">
                  {u.mimeType ?? "UNKNOWN TYPE"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={fileUrlHref(u.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="brut-button p-2.5 bg-white text-black text-xs shadow-[2px_2px_0px_0px_black]"
                title="Open file"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => handleDelete(u.id)}
                disabled={deletingId === u.id}
                className="brut-button p-2.5 bg-rose-500 text-white text-xs shadow-[2px_2px_0px_0px_black] disabled:bg-gray-200"
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
