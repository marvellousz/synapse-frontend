"use client";

import { useRouter } from "next/navigation";
import SemanticSearch from "@/components/SemanticSearch";

export default function SearchPage() {
  const router = useRouter();

  const handleMemorySelect = (memoryId: string) => {
    router.push(`/memories/${memoryId}`);
  };

  return (
    <div className="space-y-12">
      <div>
        <div className="brut-badge mb-2 bg-indigo-100 text-indigo-700">Deep Inquiry</div>
        <h1 className="heading-brut text-5xl md:text-6xl">Search.</h1>
      </div>

      <div className="brut-card p-10 bg-white">
        <SemanticSearch onMemorySelect={handleMemorySelect} />
      </div>
    </div>
  );
}
