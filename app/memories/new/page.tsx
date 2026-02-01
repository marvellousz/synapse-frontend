"use client";

import { useRouter } from "next/navigation";
import MemoryForm from "@/components/MemoryForm";
import { createMemory, uploadFiles } from "@/lib/api";
import type { MemoryCreate } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewMemoryPage() {
  const router = useRouter();

  async function handleCreate(body: MemoryCreate, files?: File[]) {
    const memory = await createMemory(body);
    if (files?.length) {
      await uploadFiles(memory.id, files);
    }
    router.push(`/memories/${memory.id}`);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/memories"
        className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
        style={{ color: "#94A3B8" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to memories
      </Link>
      <h1 className="instrument-serif text-3xl font-bold" style={{ color: "#F8FAFC" }}>
        New memory
      </h1>
      <div className="max-w-xl">
        <MemoryForm mode="create" onSubmit={handleCreate} />
      </div>
    </div>
  );
}
