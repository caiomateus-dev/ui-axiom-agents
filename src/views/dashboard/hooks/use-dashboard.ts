import { useQuery } from "@tanstack/react-query";

import { listAgents } from "@/views/agents/api/list-agents";
import { listApiKeys } from "@/views/api-keys/api/list-api-keys";
import { listApplications } from "@/views/applications/api/list-applications";
import { getAuditStats } from "@/views/audit-logs/api/get-audit-stats";
import { listAudits } from "@/views/audit-logs/api/list-audits";

export function useDashboard() {
  const agents = useQuery({ queryKey: ["agents"], queryFn: listAgents });
  const applications = useQuery({ queryKey: ["applications"], queryFn: listApplications });
  const auditStats = useQuery({ queryKey: ["audit-stats"], queryFn: getAuditStats });
  const apiKeys = useQuery({ queryKey: ["api-keys"], queryFn: () => listApiKeys() });
  const recentAudits = useQuery({
    queryKey: ["audits", "recent"],
    queryFn: () => listAudits({ page: 1, limit: 10 }),
  });
  const modelAudits = useQuery({
    queryKey: ["audits", "model-usage"],
    queryFn: () => listAudits({ page: 1, limit: 100 }),
  });

  const agentsList = agents.data ?? [];
  const activeAgents = agentsList.filter((a) => a.is_active).length;
  const appsList = applications.data ?? [];
  const activeApps = appsList.filter((a) => a.is_active).length;
  const apiKeysList = apiKeys.data ?? [];
  const totalApiUsage = apiKeysList.reduce((sum, k) => sum + k.usage_count, 0);
  const byAgent = auditStats.data?.by_agent ?? [];
  const totalPromptTokens = byAgent.reduce((sum, a) => sum + a.prompt_tokens, 0);
  const totalCompletionTokens = byAgent.reduce((sum, a) => sum + a.completion_tokens, 0);

  // Model distribution from real audit usage
  const modelDistribution = (modelAudits.data?.items ?? []).reduce<Record<string, number>>(
    (acc, audit) => {
      const model = audit.model_used || "Desconhecido";
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    },
    {},
  );
  const modelData = Object.entries(modelDistribution)
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count);

  return {
    // Counts
    agentCount: agentsList.length,
    activeAgents,
    appCount: appsList.length,
    activeApps,
    apiKeyCount: apiKeysList.length,
    totalApiUsage,
    totalEvents: auditStats.data?.total_events ?? 0,
    totalTokens: auditStats.data?.total_tokens ?? 0,
    totalPromptTokens,
    totalCompletionTokens,
    // Chart data
    byAgent,
    byEventType: auditStats.data?.by_event_type ?? [],
    modelData,
    // Recent activity
    recentAudits: recentAudits.data?.items ?? [],
    // Loading states
    isAgentsLoading: agents.isLoading,
    isAppsLoading: applications.isLoading,
    isStatsLoading: auditStats.isLoading,
    isApiKeysLoading: apiKeys.isLoading,
    isRecentLoading: recentAudits.isLoading,
    isModelLoading: modelAudits.isLoading,
  };
}
