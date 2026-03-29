"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Brain } from "lucide-react";

import { verifyEmail } from "@/lib/api";
import ToastMessage from "@/components/ToastMessage";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("verifying your email...");

  useEffect(() => {
    let active = true;

    async function run() {
      if (!token) {
        if (!active) return;
        setStatus("error");
        setMessage("missing verification token");
        return;
      }
      try {
        const res = await verifyEmail(token);
        if (!active) return;
        setStatus("success");
        setMessage(res.message);
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "verification failed");
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen grid-bg py-16 px-6">
      <ToastMessage
        message={message}
        variant={status === "success" ? "success" : status === "error" ? "error" : "info"}
        onClose={() => setMessage("")}
      />
      <div className="max-w-md mx-auto">
        <div className="mb-12 flex flex-col items-center">
          <Link href="/" className="mb-8 p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_black] -rotate-2 hover:rotate-0 transition-transform inline-block">
            <Brain className="w-8 h-8 text-indigo-600" />
          </Link>
          <h1 className="heading-brut text-4xl mb-2 text-center">Verify Email.</h1>
          <p className="font-bold text-gray-500 uppercase text-xs tracking-widest text-center">one sec, checking your link</p>
        </div>

        <div className="brut-card p-8 bg-white relative space-y-4">
          <p className="font-bold text-sm text-gray-600 uppercase tracking-widest text-center">
            {status === "success" ? "email verified" : status === "error" ? "verification failed" : "verifying..."}
          </p>
          <div className="text-center pt-2">
            <Link href="/login" className="font-black uppercase text-sm text-indigo-600 underline decoration-2 underline-offset-4 hover:bg-indigo-50">
              go to login
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="font-black uppercase text-sm flex items-center justify-center gap-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen grid-bg py-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="brut-card p-8 bg-white relative">
          <p className="font-black uppercase text-xs tracking-widest text-gray-500 text-center">loading verification...</p>
        </div>
      </div>
    </div>
  );
}
