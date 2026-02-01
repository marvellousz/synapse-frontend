"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listMemories } from "@/lib/api";
import type { Memory } from "@/lib/types";
import MemoryCard from "@/components/MemoryCard";
import SemanticSearch from "@/components/SemanticSearch";
import { PlusCircle, Loader2, Search } from "lucide-react";

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listMemories({ take: 50 })
      .then((data) => {
        if (!cancelled) setMemories(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load memories");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMemorySelect = (memoryId: string) => {
    setShowSearch(false);
    router.push(`/memories/${memoryId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="instrument-serif text-3xl font-bold" style={{ color: "#F8FAFC" }}>
          Memories
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90"
            style={{ 
              background: showSearch ? "#7c3aed" : "#64748b",
              color: "#FFFFFF"
            }}
          >
            <Search className="w-4 h-4" />
            {showSearch ? "Hide" : "Search"}
          </button>
          <Link
            href="/memories/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90"
            style={{ background: "#3B82F6", color: "#FFFFFF" }}
          >
            <PlusCircle className="w-4 h-4" />
            New memory
          </Link>
        </div>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div
          className="glass-surface rounded-2xl p-6 border"
          style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
        >
          <SemanticSearch onMemorySelect={handleMemorySelect} />
        </div>
      )}

      {error && (
        <div
          className="p-4 rounded-xl border"
          style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#FCA5A5" }}
        >
          {error}. Make sure the API is running at{" "}
          {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16" style={{ color: "#94A3B8" }}>
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : memories.length === 0 ? (
        <div
          className="glass-surface rounded-2xl p-12 border text-center"
          style={{ borderColor: "rgba(148, 163, 184, 0.2)", color: "#94A3B8" }}
        >
          <p className="mb-4">No memories yet.</p>
          <Link
            href="/memories/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm"
            style={{ background: "#3B82F6", color: "#FFFFFF" }}
          >
            <PlusCircle className="w-4 h-4" />
            Create your first memory
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-1">
          {memories.map((m) => (
            <li key={m.id}>
              <MemoryCard memory={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
