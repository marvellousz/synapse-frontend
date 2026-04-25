"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listMemories } from "@/lib/api";
import type { Memory } from "@/lib/types";
import MemoryCard from "@/components/MemoryCard";
import SortDropdown from "@/components/SortDropdown";
import { useMemoryCategories } from "@/hooks/useMemoryCategories";
import { PlusCircle, Loader2, Search, Folder, X, LayoutGrid, CalendarDays } from "lucide-react";

type FolderView = "category" | "date";

const formatDateLabel = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function MemoriesPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlDate = searchParams.get("date");

  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory);
  const [selectedDate, setSelectedDate] = useState<string | null>(urlDate);
  const [folderView, setFolderView] = useState<FolderView>(urlDate ? "date" : "category");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { categories } = useMemoryCategories();

  useEffect(() => {
    setSelectedCategory(urlCategory);
    if (urlCategory) {
      setFolderView("category");
      setSelectedDate(null);
    }
  }, [urlCategory]);

  useEffect(() => {
    setSelectedDate(urlDate);
    if (urlDate) {
      setFolderView("date");
      setSelectedCategory(null);
    }
  }, [urlDate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listMemories({ take: 100 })
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

  const dateFolders = useMemo(() => {
    const counts = new Map<string, number>();
    memories.forEach((memory) => {
      const dateKey = memory.createdAt.slice(0, 10);
      counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([key, count]) => ({ key, label: formatDateLabel(key), count }));
  }, [memories]);

  const filteredMemories = useMemo(() => {
    if (folderView === "category" && selectedCategory) {
      return memories.filter((memory) => (memory.category ?? "Miscellaneous") === selectedCategory);
    }
    if (folderView === "date" && selectedDate) {
      return memories.filter((memory) => memory.createdAt.slice(0, 10) === selectedDate);
    }
    return memories;
  }, [folderView, memories, selectedCategory, selectedDate]);

  const sortedMemories = useMemo(() => {
    return [...filteredMemories].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredMemories, sortOrder]);

  return (
    <div className="space-y-12 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="heading-brut text-5xl md:text-6xl">Memories.</h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <SortDropdown
            value={sortOrder}
            onChange={(value) => setSortOrder(value as "newest" | "oldest")}
            options={[
              { value: "newest", label: "Most Recent" },
              { value: "oldest", label: "Least Recent" },
            ]}
          />

          <Link
            href="/memories/new"
            className="brut-button px-4 py-3 bg-indigo-600 text-white flex items-center font-bold text-xs uppercase shadow-[2px_2px_0px_0px_black] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_black] transition-all"
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
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  setFolderView("category");
                  setSelectedDate(null);
                }}
                className={`px-2 py-2 border-2 border-black font-black text-[10px] uppercase ${folderView === "category" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
              >
                Category
              </button>
              <button
                onClick={() => {
                  setFolderView("date");
                  setSelectedCategory(null);
                }}
                className={`px-2 py-2 border-2 border-black font-black text-[10px] uppercase ${folderView === "date" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
              >
                Date
              </button>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedDate(null);
                }}
                className={`flex items-center justify-between px-3 py-2 border-2 border-black font-bold text-xs uppercase transition-all ${!selectedCategory && !selectedDate ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3" />
                  All Memories
                </span>
                <span className="opacity-50">{!selectedCategory && !selectedDate ? memories.length : ''}</span>
              </button>

              {folderView === "category" ? (
                categories.map(({ category: cat }) => (
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
                ))
              ) : (
                dateFolders.map((dateFolder) => (
                  <button
                    key={dateFolder.key}
                    onClick={() => setSelectedDate(dateFolder.key === selectedDate ? null : dateFolder.key)}
                    className={`flex items-center justify-between px-3 py-2 border-2 border-black font-bold text-xs uppercase transition-all ${selectedDate === dateFolder.key ? 'bg-indigo-600 text-white border-indigo-600 shadow-[4px_4px_0px_0px_black]' : 'bg-white text-black hover:bg-indigo-50 hover:border-indigo-400'}`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays className="w-3 h-3" />
                      {dateFolder.label}
                    </span>
                    <span className={`text-[10px] ${selectedDate === dateFolder.key ? "text-white/80" : "text-gray-500"}`}>
                      {dateFolder.count}
                    </span>
                  </button>
                ))
              )}
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

          {(selectedCategory || selectedDate) && !loading && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Filtering by:</span>
              <div className="brut-badge bg-indigo-600 text-white flex items-center gap-2">
                {selectedCategory || formatDateLabel(selectedDate ?? "")}
                <button onClick={() => {
                  setSelectedCategory(null);
                  setSelectedDate(null);
                }}>
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
          ) : sortedMemories.length === 0 ? (
            <div className="brut-card p-16 bg-white text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 border-4 border-black flex items-center justify-center mb-8 rotate-[-5deg]">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="heading-brut text-3xl mb-4">{selectedCategory || selectedDate ? 'Folder Empty' : 'No memories yet.'}</h3>
              <p className="font-bold text-gray-500 mb-10 max-w-sm uppercase text-sm tracking-widest">
                {selectedCategory || selectedDate
                  ? `No memories found in the "${selectedCategory || formatDateLabel(selectedDate ?? "")}" folder.`
                  : "Your second brain is currently empty. Start by capturing your first thought."}
              </p>
              {!selectedCategory && !selectedDate ? (
                <Link
                  href="/memories/new"
                  className="brut-button px-10 py-4 text-xl"
                >
                  <PlusCircle className="w-6 h-6 mr-2" />
                  CREATE FIRST MEMORY
                </Link>
              ) : (
                <button onClick={() => {
                  setSelectedCategory(null);
                  setSelectedDate(null);
                }} className="brut-button">Clear Filter</button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {sortedMemories.map((m) => (
                <MemoryCard key={m.id} memory={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
