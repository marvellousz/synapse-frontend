"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMemoryCategories } from "@/lib/api";
import { Loader2, Folder, ArrowRight, Layers, LayoutGrid, Info, Search } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

interface CategorySummary {
  category: string;
  count: number;
}

export default function FoldersPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMemoryCategories()
      .then(setCategories)
      .catch((err) => setError(err.message || "Failed to load folders"))
      .finally(() => setLoading(false));
  }, []);

  const getCategoryImage = (cat: string) => {
    const mapping: Record<string, string> = {
      "Work": "/category-images/work.png",
      "Personal": "/category-images/personal.png",
      "Technology": "/category-images/technology.png",
      "Finance": "/category-images/finance.png",
    };
    return mapping[cat] || null;
  };

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
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Folder className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="font-black uppercase text-xs tracking-[0.3em] text-gray-400 animate-pulse">Scanning Data Sectors...</p>
        </div>
      ) : error ? (
        <div className="brut-card p-12 bg-rose-50 border-rose-500 text-rose-700 text-center max-w-2xl mx-auto shadow-[12px_12px_0px_0px_rgba(244,63,94,1)]">
          <h2 className="heading-brut text-4xl mb-4">Read Error</h2>
          <p className="font-black mb-8 uppercase text-sm tracking-widest leading-relaxed">{error}</p>
          <button onClick={() => window.location.reload()} className="brut-button bg-rose-500 w-full justify-center py-4">Retry Hardware Scan</button>
        </div>
      ) : categories.length === 0 ? (
          <div className="brut-card p-16 bg-white text-center flex flex-col items-center max-w-3xl mx-auto border-dashed">
            <div className="w-24 h-24 bg-gray-50 border-4 border-black border-dashed flex items-center justify-center mb-8">
              <Folder className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="heading-brut text-4xl mb-4 italic">No Segments.</h3>
            <p className="font-black text-gray-400 uppercase text-xs tracking-widest leading-relaxed max-w-md">The disk is clean. Upload content to trigger the autonomous categorization engine and populate your directories.</p>
            <Link href="/memories/new" className="brut-button mt-10 px-12 py-5 text-lg">Initialize Brain</Link>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
            >
              <Link href={`/memories?category=${encodeURIComponent(cat.category)}`} className="group block">
                <div className="relative pt-8">
                  {/* Folder Tab with category color */}
                  <div className={`absolute top-0 left-0 w-28 h-10 ${getCategoryColor(cat.category)} border-[4px] border-black transition-all group-hover:-translate-y-2 flex items-center justify-center`}>
                     <div className="w-20 h-1 bg-black/20" />
                  </div>
                  
                  {/* Folder Body */}
                  <div className="brut-card bg-white p-0 relative h-[18rem] flex flex-col group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                    {/* Category Image / Banner */}
                    <div className="flex-1 relative bg-gray-50 overflow-hidden border-b-[4px] border-black">
                      {getCategoryImage(cat.category) ? (
                        <Image 
                          src={getCategoryImage(cat.category)!} 
                          alt={cat.category}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
                           <Folder className="w-48 h-48" />
                        </div>
                      )}
                      
                      {/* Count Badge - Neobrutalist style */}
                      <div className="absolute top-4 right-4 bg-white border-[3px] border-black px-3 py-1 font-black text-[10px] tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {cat.count} FILES
                      </div>
                    </div>

                    {/* Folder Footer Info */}
                    <div className="p-5 bg-white flex flex-col gap-1 relative overflow-hidden">
                       <div className={`absolute left-0 top-0 bottom-0 w-2 ${getCategoryColor(cat.category)} border-r-2 border-black`} />
                       <div className="flex items-center justify-between pl-2">
                        <div>
                          <h3 className="heading-brut text-2xl leading-none uppercase tracking-tighter">{cat.category}</h3>
                        </div>
                        <div className="w-10 h-10 border-[3px] border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
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
            Synapse categorizes your high-resolution memories using semantic clustering. These virtual folders are not static; they represent the evolving structure of your personal knowledge engine.
          </p>
        </div>
      </div>
    </div>
  );
}
