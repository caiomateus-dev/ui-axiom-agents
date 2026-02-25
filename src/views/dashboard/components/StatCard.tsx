import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  isLoading?: boolean;
  subtitle?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("pt-BR");
}

export function StatCard({ title, value, icon: Icon, isLoading, subtitle }: StatCardProps) {
  return (
    <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-brand-500" />
        <span className="text-sm font-medium text-text-muted">{title}</span>
      </div>
      {isLoading ? (
        <div className="h-8 w-20 mt-1 rounded bg-border-subtle animate-pulse" />
      ) : (
        <>
          <p className="text-2xl font-bold text-text-main mt-1">{formatNumber(value)}</p>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          )}
        </>
      )}
    </div>
  );
}
