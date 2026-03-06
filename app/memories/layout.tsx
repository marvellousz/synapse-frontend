"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function MemoriesLayout({
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
      <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
