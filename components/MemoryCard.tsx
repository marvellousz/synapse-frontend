"use client";

import Link from "next/link";
import type { Memory } from "@/lib/types";
import { FileText, Calendar, ArrowRight } from "lucide-react";

export default function MemoryCard({ memory }: { memory: Memory }) {
  const date = new Date(memory.createdAt).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

  const statusColors = {
    ready: "bg-emerald-500 text-white",
    failed: "bg-rose-500 text-white",
    processing: "bg-indigo-600 text-white"
  };

  return (
    <Link href={`/memories/${memory.id}`} className="group block">
      <div className="brut-card p-6 bg-white relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="brut-badge text-[10px] py-0.5 px-2 bg-indigo-100 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span className="font-black">{memory.type}</span>
            </div>
            {memory.category && (
               <div className="brut-badge text-[10px] py-0.5 px-2 bg-amber-100 flex items-center gap-1 border-amber-500 text-amber-900">
                <span className="font-black">/{memory.category}</span>
              </div>
            )}
            <div className={`brut-badge text-[10px] py-0.5 px-2 font-black border-2 border-black ${statusColors[memory.status as keyof typeof statusColors] || 'bg-gray-500 text-white'}`}>
              {memory.status.toUpperCase()}
            </div>
          </div>

          <h3 className="font-black text-2xl mb-2 group-hover:text-indigo-600 transition-colors uppercase truncate">
            {memory.title || "Untitled memory"}
          </h3>

          <p className="font-bold text-gray-500 line-clamp-2 text-sm max-w-2xl leading-snug mb-4">
            {memory.summary || memory.extractedText?.slice(0, 150) || "No summary available."}
          </p>

          <div className="flex items-center gap-4 text-xs font-black uppercase text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white border-4 border-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-[4px_4px_0px_0px_black] group-hover:shadow-[0px_0px_0px_0px_black] group-hover:translate-x-[4px] group-hover:translate-y-[4px]">
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
    </Link>
  );
}
