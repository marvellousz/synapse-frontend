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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function startUpload(selectedFiles: FileList) {
    if (!selectedFiles.length) return;
    setError(null);
    setLoading(true);
    try {
      const list = Array.from(selectedFiles);
      const result = await uploadFiles(memoryId, list);
      onUploaded(result);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-500 text-rose-700 font-bold text-sm shadow-[4px_4px_0px_0px_#F43F5E]">
          {error}
        </div>
      )}

      <div className="relative group">
        <label
          className={`block p-10 bg-white border-4 border-black border-dashed transition-all cursor-pointer ${loading ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-indigo-600 hover:bg-gray-50'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.heic,.mp4,.webm,.mov,.avi,.txt,.md,.csv,.json"
            onChange={(e) => e.target.files && startUpload(e.target.files)}
            className="sr-only"
            disabled={loading}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <UploadIcon className="w-8 h-8 text-gray-300 group-hover:text-indigo-600 transition-colors" />
            <p className="font-black uppercase text-[10px] tracking-widest text-gray-400 group-hover:text-black transition-colors">
              DRAG & DROP OR CLICK TO SYNC DATA
            </p>
          </div>
        </label>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm border-4 border-indigo-600">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="font-black uppercase text-[10px] tracking-widest text-indigo-600 animate-pulse">
                Syncing Data Stream...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
