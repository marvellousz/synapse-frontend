"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getMemory,
  updateMemory,
  deleteMemory,
  listUploads,
  processMemory,
} from "@/lib/api";
import type { Memory, MemoryUpdate, Upload } from "@/lib/types";
import ConfirmDialog from "@/components/ConfirmDialog";
import MemoryForm from "@/components/MemoryForm";
import UploadForm from "@/components/UploadForm";
import UploadList from "@/components/UploadList";
import { ArrowLeft, Loader2, Trash2, Edit2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [extractedExpanded, setExtractedExpanded] = useState(false);
  const EXTRACTED_PREVIEW_LEN = 400;

  function load() {
    setLoading(true);
    setError(null);
    Promise.all([getMemory(id), listUploads(id)])
      .then(([mem, ups]) => {
        setMemory(mem);
        setUploads(ups);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleUpdate(body: MemoryUpdate) {
    if (!memory) return;
    const updated = await updateMemory(memory.id, body);
    setMemory(updated);
    setEditing(false);
  }

  function handleDeleteClick() {
    setShowDeleteConfirm(true);
  }

  async function handleDeleteConfirm() {
    if (!memory) return;
    setDeleting(true);
    try {
      await deleteMemory(memory.id);
      setShowDeleteConfirm(false);
      router.push("/memories");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed. Is the backend running?");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  async function handleProcess() {
    if (!memory) return;
    setProcessing(true);
    try {
      await processMemory(memory.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Process failed");
    } finally {
      setProcessing(false);
    }
  }

  if (loading && !memory) {
    return (
      <div className="flex items-center justify-center py-16" style={{ color: "#94A3B8" }}>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="space-y-4">
        <Link
          href="/memories"
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: "#94A3B8" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to memories
        </Link>
        <div
          className="p-4 rounded-xl border"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.3)",
            color: "#FCA5A5",
          }}
        >
          {error ?? "Memory not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/memories"
          className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
          style={{ color: "#94A3B8" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to memories
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors hover:bg-white/5"
            style={{ borderColor: "rgba(148, 163, 184, 0.3)", color: "#CBD5E1" }}
          >
            <Edit2 className="w-4 h-4" />
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-red-500/20"
            style={{ color: "#F87171" }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {editing ? (
        <div className="max-w-xl">
          <h2 className="instrument-serif text-xl font-semibold mb-4" style={{ color: "#F8FAFC" }}>
            Edit memory
          </h2>
          <MemoryForm
            mode="edit"
            initial={memory}
            memoryId={memory.id}
            onSubmit={handleUpdate}
          />
        </div>
      ) : (
        <div
          className="glass-surface rounded-2xl p-6 border space-y-6"
          style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="instrument-serif text-2xl font-bold" style={{ color: "#F8FAFC" }}>
              {memory.title || "Untitled memory"}
            </h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
              style={{
                background:
                  memory.status === "ready"
                    ? "rgba(34, 197, 94, 0.2)"
                    : memory.status === "failed"
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(148, 163, 184, 0.2)",
                color:
                  memory.status === "ready"
                    ? "#86EFAC"
                    : memory.status === "failed"
                      ? "#FCA5A5"
                      : "#94A3B8",
              }}
            >
              {memory.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm" style={{ color: "#94A3B8" }}>
            <span>Type: {memory.type}</span>
            <span>Created: {new Date(memory.createdAt).toLocaleString()}</span>
          </div>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
              Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {memory.summary
                ? memory.summary
                : memory.extractedText
                  ? `${memory.extractedText.slice(0, 300).trim()}${memory.extractedText.length > 300 ? "…" : ""}`
                  : "No summary yet. Re-process after uploading files."}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {memory.tags && memory.tags.length > 0 ? (
                memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{
                      background: "rgba(148, 163, 184, 0.15)",
                      color: "#CBD5E1",
                      border: "1px solid rgba(148, 163, 184, 0.25)",
                    }}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm" style={{ color: "#64748B" }}>
                  {memory.extractedText
                    ? "No tags yet. Ensure GEMINI_API_KEY is set in the backend and re-process for AI-generated tags."
                    : "No tags. Upload files (PDF, image, video, or text) and re-process to generate tags from content."}
                </span>
              )}
            </div>
          </section>

          {memory.extractedText && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
                Extracted content
              </h3>
              <div
                className="rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  color: "#94A3B8",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  maxHeight: extractedExpanded ? "none" : "12rem",
                  overflow: extractedExpanded ? "visible" : "hidden",
                }}
              >
                {extractedExpanded
                  ? memory.extractedText
                  : memory.extractedText.length <= EXTRACTED_PREVIEW_LEN
                    ? memory.extractedText
                    : `${memory.extractedText.slice(0, EXTRACTED_PREVIEW_LEN)}…`}
              </div>
              {memory.extractedText.length > EXTRACTED_PREVIEW_LEN && (
                <button
                  type="button"
                  onClick={() => setExtractedExpanded(!extractedExpanded)}
                  className="mt-2 inline-flex items-center gap-1 text-sm"
                  style={{ color: "#64748B" }}
                >
                  {extractedExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show more
                    </>
                  )}
                </button>
              )}
            </section>
          )}

          {memory.sourceUrl && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
                Source
              </h3>
              <a
                href={memory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline break-all"
                style={{ color: "#3B82F6" }}
              >
                {memory.sourceUrl}
              </a>
            </section>
          )}

          <div className="pt-2 border-t" style={{ borderColor: "rgba(148, 163, 184, 0.15)" }}>
            <button
              type="button"
              onClick={handleProcess}
              disabled={processing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors disabled:opacity-50"
              style={{ borderColor: "rgba(148, 163, 184, 0.3)", color: "#94A3B8" }}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {processing ? "Processing…" : "Re-process (extract & summarize)"}
            </button>
          </div>
        </div>
      )}

      <section className="space-y-6">
        <h2 className="instrument-serif text-xl font-semibold" style={{ color: "#F8FAFC" }}>
          Files
        </h2>
        <UploadForm memoryId={id} onUploaded={() => load()} />
        <UploadList uploads={uploads} onDeleted={() => load()} />
      </section>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => !deleting && setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete memory?"
        message="This will permanently delete this memory and all its files. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loadingLabel="Deleting…"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
