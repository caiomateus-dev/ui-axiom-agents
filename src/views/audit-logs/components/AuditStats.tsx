import { Spinner } from "@/components";

import type { AuditStatsResponse } from "../dtos/response/audit.response";


interface AuditStatsProps {
  stats: AuditStatsResponse | undefined;
  isLoading: boolean;
}

export function AuditStats({ stats, isLoading }: AuditStatsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner size="md" />
      </div>
    );
  }

  const topAgent =
    stats?.by_agent && stats.by_agent.length > 0
      ? stats.by_agent.reduce((max, agent) =>
          agent.total_tokens > max.total_tokens ? agent : max,
        )
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <p className="text-sm font-medium text-text-muted">Total de Eventos</p>
        <p className="text-2xl font-bold text-text-main mt-1">
          {stats?.total_events?.toLocaleString("pt-BR") ?? "-"}
        </p>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <p className="text-sm font-medium text-text-muted">Total de Tokens</p>
        <p className="text-2xl font-bold text-text-main mt-1">
          {stats?.total_tokens?.toLocaleString("pt-BR") ?? "-"}
        </p>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <p className="text-sm font-medium text-text-muted">Top Agent (por tokens)</p>
        <p className="text-2xl font-bold text-text-main mt-1">
          {topAgent?.agent_name ?? "-"}
        </p>
        {topAgent && (
          <p className="text-xs text-text-muted mt-0.5">
            {topAgent.total_tokens.toLocaleString("pt-BR")} tokens
          </p>
        )}
      </div>
    </div>
  );
}
