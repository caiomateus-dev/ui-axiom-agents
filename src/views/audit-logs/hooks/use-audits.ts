import { useQuery } from "@tanstack/react-query";

import { getAuditStats } from "../api/get-audit-stats";
import type { AuditFilters } from "../api/list-audits";
import { listAudits } from "../api/list-audits";

export function useAudits(filters: AuditFilters) {
  return useQuery({
    queryKey: ["audits", filters],
    queryFn: () => listAudits(filters),
  });
}

export function useAuditStats() {
  return useQuery({
    queryKey: ["audit-stats"],
    queryFn: getAuditStats,
  });
}
