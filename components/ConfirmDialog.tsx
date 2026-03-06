"use client";

import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  variant?: "danger" | "warning" | "neutral";
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loadingLabel = "Loading…",
  variant = "danger",
  loading = false,
}: Props) {
  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: "rgba(239, 68, 68, 0.2)",
      iconColor: "#FCA5A5",
      button: "rgba(239, 68, 68, 0.2)",
      buttonHover: "rgba(239, 68, 68, 0.3)",
      buttonText: "#FCA5A5",
    },
    warning: {
      icon: "rgba(234, 179, 8, 0.2)",
      iconColor: "#FCD34D",
      button: "rgba(234, 179, 8, 0.2)",
      buttonHover: "rgba(234, 179, 8, 0.3)",
      buttonText: "#FCD34D",
    },
    neutral: {
      icon: "rgba(148, 163, 184, 0.2)",
      iconColor: "#94A3B8",
      button: "rgba(148, 163, 184, 0.2)",
      buttonHover: "rgba(148, 163, 184, 0.3)",
      buttonText: "#94A3B8",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_black] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 brut-button p-1 bg-white hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 border-2 border-black flex items-center justify-center rotate-[-5deg] ${variant === 'danger' ? 'bg-rose-500' :
                variant === 'warning' ? 'bg-amber-400' :
                  'bg-indigo-600'
              }`}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h3 className="heading-brut text-2xl uppercase italic">
              {title}
            </h3>
          </div>

          <p className="font-bold text-gray-600 uppercase text-xs tracking-widest leading-relaxed">
            {message}
          </p>

          <div className="mt-2 flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="brut-button bg-white text-black text-xs px-6"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`brut-button text-xs px-6 ${variant === 'danger' ? 'bg-rose-500' :
                  variant === 'warning' ? 'bg-amber-400 text-black' :
                    'bg-indigo-600'
                }`}
            >
              {loading ? loadingLabel : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
