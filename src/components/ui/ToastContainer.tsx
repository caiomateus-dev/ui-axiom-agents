import { createPortal } from "react-dom";

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

import type { ToastType } from "@/contexts/ToastContext";
import { useToastState } from "@/contexts/ToastContext";

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, string> = {
  success: "bg-success-bg border-success-border text-success-text",
  error: "bg-error-bg border-error-border text-error-text",
  info: "bg-info-bg border-info-border text-info-text",
  warning: "bg-warning-bg border-warning-border text-warning-text",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastState();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`animate-slide-in flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${styles[toast.type]}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
