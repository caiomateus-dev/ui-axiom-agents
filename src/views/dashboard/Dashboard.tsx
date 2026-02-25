import {
  Activity,
  AppWindow,
  Bot,
  CheckCircle,
  Hash,
  Key,
  MessageSquare,
  Zap,
} from "lucide-react";

import {
  AgentPerformanceTable,
  EventsByTypeChart,
  ModelDistributionChart,
  RecentActivity,
  StatCard,
  TokenBreakdownChart,
  TokensByAgentChart,
} from "./components";
import { useDashboard } from "./hooks/use-dashboard";

export function Dashboard() {
  const {
    agentCount,
    activeAgents,
    appCount,
    activeApps,
    apiKeyCount,
    totalApiUsage,
    totalEvents,
    totalTokens,
    totalPromptTokens,
    totalCompletionTokens,
    byAgent,
    byEventType,
    modelData,
    recentAudits,
    isAgentsLoading,
    isAppsLoading,
    isStatsLoading,
    isApiKeysLoading,
    isRecentLoading,
    isModelLoading,
  } = useDashboard();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-main">Dashboard</h1>
      <p className="text-text-muted mt-1">Bem-vindo ao Axiom Agents</p>

      {/* Row 1: Primary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Agents"
          value={agentCount}
          icon={Bot}
          isLoading={isAgentsLoading}
          subtitle={`${activeAgents} ativos`}
        />
        <StatCard
          title="Applications"
          value={appCount}
          icon={AppWindow}
          isLoading={isAppsLoading}
          subtitle={`${activeApps} ativas`}
        />
        <StatCard
          title="Total de Eventos"
          value={totalEvents}
          icon={Activity}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Total de Tokens"
          value={totalTokens}
          icon={Hash}
          isLoading={isStatsLoading}
        />
      </div>

      {/* Row 2: Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard
          title="API Keys"
          value={apiKeyCount}
          icon={Key}
          isLoading={isApiKeysLoading}
          subtitle={`${totalApiUsage.toLocaleString("pt-BR")} chamadas`}
        />
        <StatCard
          title="Prompt Tokens"
          value={totalPromptTokens}
          icon={MessageSquare}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Completion Tokens"
          value={totalCompletionTokens}
          icon={Zap}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Agents Ativos"
          value={activeAgents}
          icon={CheckCircle}
          isLoading={isAgentsLoading}
          subtitle={agentCount > 0 ? `${Math.round((activeAgents / agentCount) * 100)}% do total` : undefined}
        />
      </div>

      {/* Row 3: Tokens by Agent + Events by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <TokensByAgentChart data={byAgent} isLoading={isStatsLoading} />
        <EventsByTypeChart data={byEventType} isLoading={isStatsLoading} />
      </div>

      {/* Row 4: Token Breakdown + Model Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <TokenBreakdownChart data={byAgent} isLoading={isStatsLoading} />
        <ModelDistributionChart data={modelData} isLoading={isModelLoading} />
      </div>

      {/* Row 5: Agent Performance + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <AgentPerformanceTable data={byAgent} isLoading={isStatsLoading} />
        <RecentActivity data={recentAudits} isLoading={isRecentLoading} />
      </div>
    </div>
  );
}
