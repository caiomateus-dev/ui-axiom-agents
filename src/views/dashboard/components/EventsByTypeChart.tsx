import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { EventTypeStats } from "@/views/audit-logs/dtos/response/audit.response";

interface EventsByTypeChartProps {
  data: EventTypeStats[];
  isLoading?: boolean;
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
];

export function EventsByTypeChart({ data, isLoading }: EventsByTypeChartProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Eventos por Tipo</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="h-full w-full rounded bg-border-subtle animate-pulse" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Eventos por Tipo</h3>
        <div className="h-64 flex items-center justify-center text-sm text-text-muted">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
      <h3 className="text-sm font-medium text-text-muted mb-4">Eventos por Tipo</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="60%" height={264}>
          <PieChart>
            <Pie
              data={data}
              dataKey="event_count"
              nameKey="event_type"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((entry, i) => (
            <div key={entry.event_type} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-text-muted flex-1">{entry.event_type}</span>
              <span className="font-medium text-text-main">{entry.event_count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
