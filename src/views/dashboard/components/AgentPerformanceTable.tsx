import type { AgentTokenStats } from "@/views/audit-logs/dtos/response/audit.response";

interface AgentPerformanceTableProps {
  data: AgentTokenStats[];
  isLoading?: boolean;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("pt-BR");
}

export function AgentPerformanceTable({ data, isLoading }: AgentPerformanceTableProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Performance por Agent</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-border-subtle animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.total_tokens - a.total_tokens);
  const maxTokens = sorted[0]?.total_tokens || 1;

  if (sorted.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Performance por Agent</h3>
        <div className="h-72 flex items-center justify-center text-sm text-text-muted">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
      <h3 className="text-sm font-medium text-text-muted mb-4">Performance por Agent</h3>
      <div className="space-y-3">
        {sorted.slice(0, 8).map((agent) => {
          const pct = (agent.total_tokens / maxTokens) * 100;
          const avgTokens = agent.event_count > 0
            ? Math.round(agent.total_tokens / agent.event_count)
            : 0;

          return (
            <div key={agent.agent_name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-text-main truncate mr-2">{agent.agent_name}</span>
                <div className="flex items-center gap-3 shrink-0 text-xs text-text-muted">
                  <span>{formatNumber(agent.total_tokens)} tokens</span>
                  <span>{agent.event_count} eventos</span>
                  <span>~{formatNumber(avgTokens)}/evt</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-border-subtle overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
