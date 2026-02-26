import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { X } from "lucide-react";

const sizeClasses = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
} as const;

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: keyof typeof sizeClasses;
}

export function SlidePanel({ open, onClose, title, children, size = "md" }: SlidePanelProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 transition-opacity" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${sizeClasses[size]} h-full bg-bg-card shadow-2xl flex flex-col animate-slide-in-right`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle shrink-0">
          <h2 className="text-lg font-semibold text-text-main">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors cursor-pointer p-1 rounded-md hover:bg-bg-elevated"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
