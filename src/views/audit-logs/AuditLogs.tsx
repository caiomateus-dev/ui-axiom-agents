import { Button } from "@/components";

import { AuditFilters, AuditStats, AuditTable } from "./components";
import { useAuditLogsPage } from "./hooks";

export function AuditLogs() {
  const {
    filters,
    setFilters,
    auditData,
    isLoadingAudits,
    stats,
    isLoadingStats,
    handlePreviousPage,
    handleNextPage,
  } = useAuditLogsPage();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-main mb-6">Audit Logs</h1>

      <AuditStats stats={stats} isLoading={isLoadingStats} />

      <AuditFilters filters={filters} onChange={setFilters} />

      <AuditTable audits={auditData?.items ?? []} isLoading={isLoadingAudits} />

      {/* Pagination */}
      {auditData && auditData.total_pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-text-muted">
            Página {auditData.page} de {auditData.total_pages} ({auditData.total} registros)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePreviousPage}
              disabled={auditData.page <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNextPage}
              disabled={auditData.page >= auditData.total_pages}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
