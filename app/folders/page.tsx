"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listMemories } from "@/lib/api";
import { useMemoryCategories } from "@/hooks/useMemoryCategories";
import { Loader2, Folder, ArrowRight, Info, CalendarDays } from "lucide-react";
import { motion } from "motion/react";

interface CategorySummary {
  category: string;
  count: number;
}

interface DateSummary {
  date: string;
  count: number;
}

type FolderView = "category" | "date";

export default function FoldersPage() {
  const [dateFolders, setDateFolders] = useState<DateSummary[]>([]);
  const [folderView, setFolderView] = useState<FolderView>("category");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categories, loading: categoriesLoading, error: categoriesError } = useMemoryCategories();

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    listMemories({ take: 100 })
      .then((memories) => {
        if (cancelled) return;
        const counts = new Map<string, number>();
        memories.forEach((memory) => {
          const dateKey = memory.createdAt.slice(0, 10);
          counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
        });
        const dateData = Array.from(counts.entries())
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
          .map(([date, count]) => ({ date, count }));
        setDateFolders(dateData);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load folders");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeItems = useMemo(
    () => (folderView === "category" ? categories : dateFolders),
    [folderView, categories, dateFolders]
  );

  const getCategoryColor = (cat: string) => {
      const colors: Record<string, string> = {
          "Work": "bg-indigo-600",
          "Personal": "bg-pink-500",
          "Technology": "bg-emerald-500",
          "Finance": "bg-amber-500",
          "Education": "bg-yellow-500",
          "Health": "bg-rose-500",
          "Science": "bg-blue-500",
          "Entertainment": "bg-purple-500",
          "Travel": "bg-orange-500",
          "Miscellaneous": "bg-gray-500",
      };
      return colors[cat] || "bg-gray-400";
  };

  return (
    <div className="space-y-12">
      {/* Header section consistent with Archive */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-4 border-black">
        <div>
          <h1 className="heading-brut text-5xl md:text-6xl">Folders.</h1>
          <p className="font-bold text-gray-400 uppercase text-xs tracking-[0.2em] mt-2">Manage your structured brain segments</p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
          <button
            onClick={() => setFolderView("category")}
            className={`px-3 py-2 border-2 border-black font-black text-[10px] uppercase ${folderView === "category" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
          >
            Category Folders
          </button>
          <button
            onClick={() => setFolderView("date")}
            className={`px-3 py-2 border-2 border-black font-black text-[10px] uppercase ${folderView === "date" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
          >
            Date Folders
          </button>
        </div>
      </div>

      {loading || categoriesLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Folder className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="font-black uppercase text-xs tracking-[0.3em] text-gray-400 animate-pulse">Scanning Data Sectors...</p>
        </div>
      ) : error || categoriesError ? (
        <div className="brut-card p-12 bg-rose-50 border-rose-500 text-rose-700 text-center max-w-2xl mx-auto shadow-[12px_12px_0px_0px_rgba(244,63,94,1)]">
          <h2 className="heading-brut text-4xl mb-4">Read Error</h2>
          <p className="font-black mb-8 uppercase text-sm tracking-widest leading-relaxed">{error ?? categoriesError}</p>
          <button onClick={() => window.location.reload()} className="brut-button bg-rose-500 w-full justify-center py-4">Retry Hardware Scan</button>
        </div>
      ) : activeItems.length === 0 ? (
          <div className="brut-card p-16 bg-white text-center flex flex-col items-center max-w-3xl mx-auto border-dashed">
            <div className="w-24 h-24 bg-gray-50 border-4 border-black border-dashed flex items-center justify-center mb-8">
              <Folder className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="heading-brut text-4xl mb-4 italic">No {folderView === "category" ? "Segments" : "Date Folders"}.</h3>
            <p className="font-black text-gray-400 uppercase text-xs tracking-widest leading-relaxed max-w-md">The disk is clean. Upload content to trigger the autonomous categorization engine and populate your directories.</p>
            <Link href="/memories/new" className="brut-button mt-10 px-12 py-5 text-lg">Initialize Brain</Link>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {activeItems.map((item, i) => (
            <motion.div
              key={folderView === "category" ? (item as CategorySummary).category : (item as DateSummary).date}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
            >
              <Link
                href={
                  folderView === "category"
                    ? `/memories?category=${encodeURIComponent((item as CategorySummary).category)}`
                    : `/memories?date=${encodeURIComponent((item as DateSummary).date)}`
                }
                className="group block"
              >
                <div className="brut-card bg-white p-5 relative overflow-hidden group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${folderView === "category" ? getCategoryColor((item as CategorySummary).category) : "bg-indigo-400"} border-r-2 border-black`} />

                  <div className="pl-4 pr-2 space-y-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 border-[3px] border-black bg-gray-50 flex items-center justify-center shrink-0">
                        {folderView === "category" ? (
                          <Folder className="w-6 h-6 text-gray-500" />
                        ) : (
                          <CalendarDays className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <h3 className="heading-brut text-3xl leading-none uppercase tracking-tighter truncate">
                        {folderView === "category"
                          ? (item as CategorySummary).category
                          : new Date((item as DateSummary).date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="bg-white border-[3px] border-black px-3 py-1 font-black text-[10px] tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {item.count} FILES
                      </div>
                      <div className="w-11 h-11 border-[3px] border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shrink-0">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cerebral Tip / Footer consistent with other pages */}
      <div className="brut-card p-8 bg-indigo-50 border-indigo-200 flex flex-col md:flex-row items-center gap-8 mt-24">
        <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center shrink-0 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]">
           <Info className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-black uppercase text-sm mb-2 text-indigo-900 border-b-2 border-indigo-200 inline-block tracking-widest">Autonomous Logical Partitioning</h4>
          <p className="text-xs font-bold text-indigo-800/60 italic leading-relaxed max-w-4xl">
            Synapse groups your memories into semantic categories and also by capture date, so you can browse your knowledge engine by topic or by timeline.
          </p>
        </div>
      </div>
    </div>
  );
}
