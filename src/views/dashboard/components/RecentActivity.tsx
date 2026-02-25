import { Bot, MessageCircle, Wrench } from "lucide-react";

import { Badge } from "@/components";

import type { AuditResponse } from "@/views/audit-logs/dtos/response/audit.response";

interface RecentActivityProps {
  data: AuditResponse[];
  isLoading?: boolean;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min atrás`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}

function formatTokens(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function RecentActivity({ data, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-border-subtle animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 rounded bg-border-subtle animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-border-subtle animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Atividade Recente</h3>
        <div className="py-8 text-center text-sm text-text-muted">Nenhuma atividade registrada</div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
      <h3 className="text-sm font-medium text-text-muted mb-4">Atividade Recente</h3>
      <div className="space-y-1">
        {data.map((audit) => {
          const isTool = audit.event_type === "tool";
          const Icon = isTool ? Wrench : audit.user_message ? MessageCircle : Bot;

          return (
            <div
              key={audit.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 text-brand-500 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-main truncate">
                    {audit.agent_name}
                  </span>
                  <Badge variant={isTool ? "warning" : "info"}>
                    {isTool ? audit.tool_name || "tool" : "chat"}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted truncate mt-0.5">
                  {isTool
                    ? `Executou ${audit.tool_name}`
                    : audit.user_message
                      ? `"${audit.user_message.slice(0, 80)}${audit.user_message.length > 80 ? "..." : ""}"`
                      : "Resposta do agent"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-text-muted">{timeAgo(audit.created_at)}</span>
                {audit.tokens_used > 0 && (
                  <p className="text-xs text-text-muted">
                    {formatTokens(audit.tokens_used)} tokens
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
