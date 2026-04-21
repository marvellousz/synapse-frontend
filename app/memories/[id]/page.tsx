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
import { ArrowLeft, Loader2, Trash2, Edit2, RefreshCw, ChevronDown, ChevronUp, Sparkles, FileText } from "lucide-react";

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

  let coverImageUrl: string | undefined = undefined;
  let isYoutube = false;
  let youtubeEmbedUrl: string | undefined = undefined;

  if (memory?.sourceUrl) {
    const ytMatch = memory.sourceUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch) {
      isYoutube = true;
      coverImageUrl = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
      const timeMatch = memory.sourceUrl.match(/[?&]t=([^&]+)/);
      const timeParam = timeMatch ? `&start=${parseInt(timeMatch[1])}` : '';
      youtubeEmbedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0${timeParam}`;
    }
  }
  if (!coverImageUrl && uploads.length > 0) {
    const imageUpload = uploads.find((u) => u.mimeType?.startsWith("image/") || u.fileType?.startsWith("image/"));
    if (imageUpload) {
      coverImageUrl = imageUpload.fileUrl;
    }
  }

  // Extract first image from markdown if no cover image exists
  if (!coverImageUrl && memory?.extractedText) {
    const imgMatch = memory.extractedText.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch) {
      coverImageUrl = imgMatch[1];
    }
  }

  if (loading && !memory) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="font-black uppercase text-xs tracking-[0.2em] text-gray-400">Loading brain memory...</p>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="space-y-6">
        <Link
          href="/memories"
          className="inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to memories
        </Link>
        <div className="brut-card p-6 bg-rose-50 border-rose-500 shadow-[8px_8px_0px_0px_#F43F5E] text-rose-700">
          <p className="font-black uppercase text-xs mb-1">Retrieval Failed</p>
          <p className="font-bold">{error ?? "Memory not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link
            href="/memories"
            className="inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to memories
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="heading-brut text-4xl md:text-5xl">
              {memory.title || "Untitled memory"}
            </h1>
            <div className={`brut-badge text-[10px] px-3 py-1 ${memory.status === "ready" ? "bg-emerald-100 text-emerald-700 border-emerald-500" :
              memory.status === "failed" ? "bg-rose-100 text-rose-700 border-rose-500" :
                "bg-amber-100 text-amber-700 border-amber-500"
              }`}>
              {memory.status}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className={`brut-button px-6 py-2.5 text-xs ${editing ? "bg-rose-500" : "bg-white text-black"}`}
          >
            {editing ? <RefreshCw className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {editing ? "CANCEL" : "EDIT"}
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="brut-button px-6 py-2.5 text-xs bg-rose-500"
          >
            <Trash2 className="w-4 h-4" />
            DELETE
          </button>
        </div>
      </div>

      {editing ? (
        <div className="brut-card p-8 bg-white max-w-2xl">
          <h2 className="heading-brut text-2xl mb-6">Modify Brain State.</h2>
          <MemoryForm
            mode="edit"
            initial={memory}
            memoryId={memory.id}
            onSubmit={handleUpdate}
          />
        </div>
      ) : (
        <div className="brut-card p-0 overflow-hidden bg-white">
          {coverImageUrl && !isYoutube && (
            <div
              className="w-full border-b-4 border-black relative bg-gray-100 flex items-center justify-center cursor-pointer"
              onClick={() => window.open(coverImageUrl, '_blank')}
            >
              <img src={coverImageUrl} alt="Cover Preview" className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
          )}
          {isYoutube && youtubeEmbedUrl && (
            <div className="w-full aspect-video border-b-4 border-black bg-black">
              <iframe
                src={youtubeEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="bg-indigo-600 border-b-4 border-black p-4 flex justify-between items-center">
            <div className="flex items-center gap-4 text-white font-black uppercase text-[10px] tracking-widest">
              <span className="bg-black/20 px-2 py-1 border border-white/20">Type: {memory.type}</span>
              <span className="bg-black/20 px-2 py-1 border border-white/20">Saved: {new Date(memory.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            {memory.sourceUrl && (
              <a
                href={memory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brut-button w-full flex items-center justify-center gap-3 py-4 text-lg bg-indigo-50 border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                VIEW ORIGINAL SOURCE
              </a>
            )}

            <section>
              <h3 className="font-black uppercase text-xs tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-600" />
                Executive Summary
              </h3>
              <div className="text-xl font-bold leading-relaxed lg:max-w-4xl text-black whitespace-pre-wrap">
                {memory.summary
                  ? memory.summary
                  : memory.extractedText
                    ? `${memory.extractedText.slice(0, 300).trim()}${memory.extractedText.length > 300 ? "…" : ""}`
                    : "No summary available. Upload files and re-process."}
              </div>
            </section>

            <section>
              <h3 className="font-black uppercase text-xs tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-600" />
                Semantic Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {memory.tags && memory.tags.length > 0 ? (
                  memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="brut-badge bg-white text-black text-xs font-black shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform cursor-default"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="font-bold text-gray-400 uppercase text-[10px]">No tags extracted yet</span>
                )}
              </div>
            </section>

            {memory.extractedText && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black uppercase text-xs tracking-widest text-rose-500 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-rose-500" />
                    Deep Content Extraction
                  </h3>
                  <button
                    type="button"
                    onClick={() => setExtractedExpanded(!extractedExpanded)}
                    className="font-black uppercase text-[10px] text-indigo-600 hover:underline"
                  >
                    {extractedExpanded ? "COLLAPSE" : "EXPAND ALL"}
                  </button>
                </div>
                <div
                  className="p-6 bg-gray-50 border-4 border-black shadow-[4px_4px_0px_0px_black] relative"
                  style={{
                    maxHeight: extractedExpanded ? "none" : "15rem",
                    overflow: "hidden",
                  }}
                >
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700">
                    {memory.extractedText}
                  </pre>
                  {!extractedExpanded && memory.extractedText.length > EXTRACTED_PREVIEW_LEN && (
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                  )}
                </div>
              </section>
            )}

            <div className="pt-8 border-t-4 border-black flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={handleProcess}
                disabled={processing}
                className="brut-button bg-white text-black px-6 py-2.5 text-[10px] tracking-widest"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {processing ? "PROCESSING BRAIN..." : "RE-PROCESS (SYNC AI STATS)"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-1 gap-12">
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black flex items-center justify-center rotate-[-5deg]">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="heading-brut text-3xl">Attachments.</h2>
          </div>
          <div className="brut-card p-8 bg-indigo-50/50">
            <UploadForm memoryId={id} onUploaded={() => load()} />
            <div className="mt-8">
              <UploadList uploads={uploads} onDeleted={() => load()} />
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => !deleting && setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="WIPE MEMORY?"
        message="THIS WILL PERMANENTLY PURGE THIS STATE FROM YOUR SECOND BRAIN. DATA LOSS IS ABSOLUTE."
        confirmLabel="PURGE"
        cancelLabel="ABORT"
        loadingLabel="PURGING..."
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
