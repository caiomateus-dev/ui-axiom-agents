import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AgentTokenStats } from "@/views/audit-logs/dtos/response/audit.response";

interface TokensByAgentChartProps {
  data: AgentTokenStats[];
  isLoading?: boolean;
}

export function TokensByAgentChart({ data, isLoading }: TokensByAgentChartProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Tokens por Agent</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="h-full w-full rounded bg-border-subtle animate-pulse" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Tokens por Agent</h3>
        <div className="h-64 flex items-center justify-center text-sm text-text-muted">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
      <h3 className="text-sm font-medium text-text-muted mb-4">Tokens por Agent</h3>
      <ResponsiveContainer width="100%" height={264}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
          <XAxis
            dataKey="agent_name"
            tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
            axisLine={{ stroke: "var(--color-border-subtle)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
            axisLine={{ stroke: "var(--color-border-subtle)" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "var(--color-text-main)" }}
          />
          <Bar dataKey="total_tokens" name="Tokens" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
