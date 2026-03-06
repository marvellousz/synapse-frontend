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
    <div className="space-y-8">
      <Link
        href="/memories"
        className="inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to archive
      </Link>
      <h1 className="heading-brut text-4xl md:text-5xl">Capture State.</h1>
      <div className="max-w-xl">
        <MemoryForm mode="create" onSubmit={handleCreate} />
      </div>
    </div>
  );
}
