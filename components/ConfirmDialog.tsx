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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border p-6 shadow-xl"
        style={{
          backgroundColor: "#1E293B",
          borderColor: "rgba(148, 163, 184, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 transition-colors hover:bg-white/5"
          style={{ color: "#94A3B8" }}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: styles.icon }}
          >
            <AlertTriangle className="w-6 h-6" style={{ color: styles.iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="instrument-serif text-lg font-semibold" style={{ color: "#F8FAFC" }}>
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
              {message}
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#94A3B8" }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                }}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{
                  background: styles.button,
                  color: styles.buttonText,
                }}
              >
                {loading ? loadingLabel : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
