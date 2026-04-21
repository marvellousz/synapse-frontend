"use client";

import { useState } from "react";
import type { Memory, MemoryCreate, MemoryUpdate } from "@/lib/types";
import Dropdown from "@/components/Dropdown";

const TYPES = ["pdf", "image", "video", "text", "webpage"] as const;
const TYPE_OPTIONS = [
  { value: "pdf" as const, label: "PDF" },
  { value: "image" as const, label: "Image" },
  { value: "video" as const, label: "Video" },
  { value: "text" as const, label: "Text" },
  { value: "webpage" as const, label: "Webpage" },
];
const STATUSES = ["processing", "ready", "failed"] as const;
const STATUS_OPTIONS = [
  { value: "processing" as const, label: "Processing" },
  { value: "ready" as const, label: "Ready" },
  { value: "failed" as const, label: "Failed" },
];
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
            sourceUrl: type === "webpage" ? (sourceUrl || null) : null,
            status: "processing",
          },
          files.length > 0 ? files : undefined
        );
      } else {
        await props.onSubmit({
          title: title || null,
          summary: summary || null,
          sourceUrl: type === "webpage" ? (sourceUrl || null) : null,
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
    <form onSubmit={handleSubmit} className="brut-card p-8 bg-white space-y-6">
      <div className="flex items-center gap-3 mb-2 underline decoration-indigo-600 decoration-4 underline-offset-4">
        <h3 className="heading-brut text-xl">{isCreate ? "NEW MEMORY" : "EDIT MEMORY"}</h3>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-500 text-rose-700 font-bold text-sm shadow-[4px_4px_0px_0px_#F43F5E] animate-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {isCreate && (
        <div className="space-y-1">
          <Dropdown
            label="Category Type"
            value={type}
            options={TYPE_OPTIONS}
            onChange={(t) => {
              setType(t as Memory["type"]);
              if (t !== "webpage") setSourceUrl("");
            }}
            placeholder="Select type"
          />
        </div>
      )}

      {showFileUpload && (
        <div className="space-y-4 p-6 bg-indigo-50 border-4 border-black border-dashed">
          <label className="block font-black uppercase text-[10px] tracking-widest text-indigo-700">
            Secure Upload: {type}
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
            className="block w-full text-xs font-black uppercase text-gray-500
              file:mr-4 file:py-2 file:px-6
              file:border-2 file:border-black
              file:font-black file:uppercase file:text-[10px]
              file:bg-black file:text-white
              hover:file:bg-gray-800 transition-colors"
          />
          {files.length > 0 && (
            <p className="font-black uppercase text-[10px] text-emerald-600">
              {files.length} FILE(S) READY FOR CAPTURE
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="block font-black uppercase text-[10px] tracking-widest text-gray-500">Title of Memory</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="brut-input py-4 font-bold bg-gray-50 focus:bg-white"
          placeholder="ENTER TITLE..."
        />
      </div>

      <div className="space-y-2">
        <label className="block font-black uppercase text-[10px] tracking-widest text-gray-500">Subject Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          className="brut-input py-4 font-bold bg-gray-50 focus:bg-white resize-none"
          placeholder="WHAT IS THIS ABOUT?"
        />
      </div>

      {type === "webpage" && (
        <div className="space-y-2">
          <label className="block font-black uppercase text-[10px] tracking-widest text-gray-500">
            EXTERNAL LINK
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="brut-input py-4 font-bold bg-gray-50 focus:bg-white"
            placeholder="https://..."
          />
        </div>
      )}

      {!isCreate && (
        <div className="space-y-1">
          <Dropdown
            label="System Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(s) => setStatus(s as Memory["status"])}
            placeholder="Select status"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="brut-button w-full justify-center py-4 text-sm bg-indigo-600 shadow-[6px_6px_0px_0px_black]"
      >
        {loading ? "PROCESSING..." : isCreate ? "CREATE MEMORY STATE" : "SAVE BRAIN UPDATE"}
      </button>
    </form>
  );
}
