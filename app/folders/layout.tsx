"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function FoldersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [state.status, router]);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="brut-card p-8 bg-white flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <span className="font-black uppercase tracking-widest text-xs">Synchronizing...</span>
        </div>
      </div>
    );
  }

  if (state.status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen grid-bg relative">
      <AppNav />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            <p className="font-black uppercase text-xs tracking-widest text-gray-400">Loading Folders...</p>
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
