"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listMemories } from "@/lib/api";
import type { Memory } from "@/lib/types";
import MemoryCard from "@/components/MemoryCard";
import { PlusCircle, Loader2, Search, Filter, Folder, X, LayoutGrid, Share2 } from "lucide-react";

const CATEGORIES = [
  "Personal", "Work", "Education", "Technology", "Finance", 
  "Health", "Entertainment", "Science", "Legal", "Travel",
  "Miscellaneous"
];

export default function MemoriesPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory);

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listMemories({ take: 100, category: selectedCategory || undefined })
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
  }, [selectedCategory]);

  return (
    <div className="space-y-12 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="heading-brut text-5xl md:text-6xl">Memories.</h1>
        </div>

        <div className="flex gap-4">
          <Link
            href="/memories/new"
            className="brut-button px-6 bg-indigo-600 text-white"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="ml-2">NEW MEMORY</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-0 flex-1">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="brut-card p-4 bg-white">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black">
              <Folder className="w-4 h-4" />
              <h3 className="font-black uppercase text-sm">Folders</h3>
            </div>
            
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center justify-between px-3 py-2 border-2 border-black font-bold text-xs uppercase transition-all ${!selectedCategory ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3" />
                  All Memories
                </span>
                <span className="opacity-50">{!selectedCategory ? memories.length : ''}</span>
              </button>
              
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={`flex items-center justify-between px-3 py-2 border-2 border-black font-bold text-xs uppercase transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-[4px_4px_0px_0px_black]' : 'bg-white text-black hover:bg-indigo-50 hover:border-indigo-400'}`}
                >
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedCategory === cat ? 'bg-white' : 'bg-indigo-400'}`} />
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="brut-card p-4 bg-amber-50 border-amber-500 text-amber-900 hidden lg:block">
            <h4 className="font-black text-xs uppercase mb-1">Cerebral Tip</h4>
            <p className="text-[10px] leading-relaxed font-bold opacity-70 italic">Categories are automatically assigned by the Synapse Brain using semantic analysis of your content.</p>
          </div>
        </div>

        {/* Memories Content */}
        <div className="flex-1 min-w-0">
          {error && (
            <div className="p-6 bg-rose-50 border-4 border-rose-500 text-rose-700 font-black shadow-[8px_8px_0px_0px_#F43F5E] mb-8">
              <p className="uppercase text-sm tracking-widest mb-2">Error detected</p>
              <p>{error}. Ensure the API is running.</p>
            </div>
          )}

          {selectedCategory && !loading && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Filtering by:</span>
              <div className="brut-badge bg-indigo-600 text-white flex items-center gap-2">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="w-3 h-3 hover:scale-125 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
              <p className="font-black uppercase text-xs tracking-[0.2em] text-gray-400">Filtering synpases...</p>
            </div>
          ) : memories.length === 0 ? (
            <div className="brut-card p-16 bg-white text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 border-4 border-black flex items-center justify-center mb-8 rotate-[-5deg]">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="heading-brut text-3xl mb-4">{selectedCategory ? 'Category Empty' : 'No memories yet.'}</h3>
              <p className="font-bold text-gray-500 mb-10 max-w-sm uppercase text-sm tracking-widest">
                {selectedCategory 
                  ? `No memories found in the "${selectedCategory}" folder.` 
                  : "Your second brain is currently empty. Start by capturing your first thought."}
              </p>
              {!selectedCategory ? (
                <Link
                  href="/memories/new"
                  className="brut-button px-10 py-4 text-xl"
                >
                  <PlusCircle className="w-6 h-6 mr-2" />
                  CREATE FIRST MEMORY
                </Link>
              ) : (
                <button onClick={() => setSelectedCategory(null)} className="brut-button">Clear Filter</button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {memories.map((m) => (
                <MemoryCard key={m.id} memory={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
