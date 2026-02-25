import { useState } from "react";

import type { AuditFilters } from "../api/list-audits";
import { useAudits, useAuditStats } from "./use-audits";

export function useAuditLogsPage() {
  const [filters, setFilters] = useState<AuditFilters>({
    page: 1,
    limit: 20,
  });

  const { data: auditData, isLoading: isLoadingAudits } = useAudits(filters);
  const { data: stats, isLoading: isLoadingStats } = useAuditStats();

  function handlePreviousPage() {
    setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page ?? 1) - 1) }));
  }

  function handleNextPage() {
    const totalPages = auditData?.total_pages ?? 1;
    setFilters((prev) => ({
      ...prev,
      page: Math.min(totalPages, (prev.page ?? 1) + 1),
    }));
  }

  return {
    filters,
    setFilters,
    auditData,
    isLoadingAudits,
    stats,
    isLoadingStats,
    handlePreviousPage,
    handleNextPage,
  };
}
