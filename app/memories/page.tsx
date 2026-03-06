"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listMemories } from "@/lib/api";
import type { Memory } from "@/lib/types";
import MemoryCard from "@/components/MemoryCard";
import { PlusCircle, Loader2, Search } from "lucide-react";

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="brut-badge mb-2 bg-emerald-100 text-emerald-700 border-emerald-500">Your Archive</div>
          <h1 className="heading-brut text-5xl md:text-6xl">Memories.</h1>
        </div>

        <div className="flex gap-4">
          <Link
            href="/memories/new"
            className="brut-button px-6 bg-indigo-600"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="ml-2">NEW MEMORY</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 border-4 border-rose-500 text-rose-700 font-black shadow-[8px_8px_0px_0px_#F43F5E] mb-8">
          <p className="uppercase text-sm tracking-widest mb-2">Error detected</p>
          <p>{error}. Ensure the API is running at {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}.</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="font-black uppercase text-xs tracking-[0.2em] text-gray-400">Loading your brain...</p>
        </div>
      ) : memories.length === 0 ? (
        <div className="brut-card p-16 bg-white text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 border-4 border-black flex items-center justify-center mb-8 rotate-[-5deg]">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="heading-brut text-3xl mb-4">No memories yet.</h3>
          <p className="font-bold text-gray-500 mb-10 max-w-sm uppercase text-sm tracking-widest">Your second brain is currently empty. Start by capturing your first thought.</p>
          <Link
            href="/memories/new"
            className="brut-button px-10 py-4 text-xl"
          >
            <PlusCircle className="w-6 h-6 mr-2" />
            CREATE FIRST MEMORY
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {memories.map((m) => (
            <MemoryCard key={m.id} memory={m} />
          ))}
        </div>
      )}
    </div>
  );
}
