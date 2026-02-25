import type { ReactNode } from "react";

type BadgeVariant = "info" | "success" | "warning" | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  info: "bg-info-bg text-info-text border border-info-border",
  success: "bg-success-bg text-success-text border border-success-border",
  warning: "bg-warning-bg text-warning-text border border-warning-border",
  error: "bg-error-bg text-error-text border border-error-border",
};

export function Badge({ variant = "info", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
