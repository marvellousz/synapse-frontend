"use client";

import { useRouter } from "next/navigation";
import SemanticSearch from "@/components/SemanticSearch";

export default function SearchPage() {
  const router = useRouter();

  const handleMemorySelect = (memoryId: string) => {
    router.push(`/memories/${memoryId}`);
  };

  return (
    <div className="space-y-8">
      <h1
        className="instrument-serif text-3xl font-bold"
        style={{ color: "#F8FAFC" }}
      >
        Search
      </h1>
      <div
        className="glass-surface rounded-2xl p-6 border"
        style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
      >
        <SemanticSearch onMemorySelect={handleMemorySelect} />
      </div>
    </div>
  );
}
