import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ModelData {
  model: string;
  count: number;
}

interface ModelDistributionChartProps {
  data: ModelData[];
  isLoading?: boolean;
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-2)",
  "var(--color-chart-6)",
];

export function ModelDistributionChart({ data, isLoading }: ModelDistributionChartProps) {
  if (isLoading) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Uso por Modelo</h3>
        <div className="h-72 rounded bg-border-subtle animate-pulse" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
        <h3 className="text-sm font-medium text-text-muted mb-4">Uso por Modelo</h3>
        <div className="h-72 flex items-center justify-center text-sm text-text-muted">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border-subtle p-5">
      <h3 className="text-sm font-medium text-text-muted mb-4">Uso por Modelo</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="55%" height={288}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="model"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
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
              labelStyle={{ color: "var(--color-text-main)" }}
              itemStyle={{ color: "var(--color-text-muted)" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((entry, i) => (
            <div key={entry.model} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-text-muted flex-1 truncate" title={entry.model}>
                {entry.model}
              </span>
              <span className="font-medium text-text-main">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
