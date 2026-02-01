"use client";

import Link from "next/link";
import type { Memory } from "@/lib/types";
import { FileText, Calendar } from "lucide-react";

export default function MemoryCard({ memory }: { memory: Memory }) {
  const date = new Date(memory.createdAt).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
  return (
    <Link href={`/memories/${memory.id}`}>
      <div
        className="glass-surface p-5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-primary/60 cursor-pointer"
        style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold truncate"
              style={{ color: "#F8FAFC", fontSize: "1.05rem" }}
            >
              {memory.title || "Untitled memory"}
            </h3>
            <p
              className="text-sm mt-1 line-clamp-2"
              style={{ color: "#94A3B8" }}
            >
              {memory.summary || memory.extractedText?.slice(0, 120) || memory.contentHash.slice(0, 16) + "…"}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "#64748B" }}>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {memory.type}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background:
                    memory.status === "ready"
                      ? "rgba(16, 185, 129, 0.2)"
                      : memory.status === "failed"
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(59, 130, 246, 0.2)",
                  color:
                    memory.status === "ready"
                      ? "#10B981"
                      : memory.status === "failed"
                        ? "#EF4444"
                        : "#3B82F6",
                }}
              >
                {memory.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
