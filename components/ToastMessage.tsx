"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastVariant = "error" | "success" | "info";

type Props = {
  message: string | null;
  variant?: ToastVariant;
  onClose: () => void;
};

export default function ToastMessage({ message, variant = "info", onClose }: Props) {
  if (!message) return null;

  const styleByVariant: Record<ToastVariant, string> = {
    error:
      "border-rose-500 bg-rose-100 text-rose-700 shadow-[4px_4px_0px_0px_#F43F5E]",
    success:
      "border-emerald-500 bg-emerald-100 text-emerald-700 shadow-[4px_4px_0px_0px_#10B981]",
    info:
      "border-indigo-500 bg-indigo-100 text-indigo-700 shadow-[4px_4px_0px_0px_#6366F1]",
  };

  const Icon = variant === "error" ? AlertCircle : variant === "success" ? CheckCircle2 : Info;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-[calc(100%-3rem)]" role="status" aria-live="polite">
      <div className={`border-2 p-4 font-bold text-sm flex items-start gap-3 ${styleByVariant[variant]}`}>
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <p className="flex-1">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-70 hover:opacity-100"
          aria-label="close toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
