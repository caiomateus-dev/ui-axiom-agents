import { Button, Input } from "@/components";

import type { AuditFilters as AuditFiltersType } from "../api/list-audits";


interface AuditFiltersProps {
  filters: AuditFiltersType;
  onChange: (filters: AuditFiltersType) => void;
}

export function AuditFilters({ filters, onChange }: AuditFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 mb-6">
      <div className="w-48">
        <Input
          id="filter-agent"
          label="Agent"
          placeholder="Nome do agent"
          value={filters.agent_name ?? ""}
          onChange={(e) =>
            onChange({ ...filters, agent_name: e.target.value || undefined, page: 1 })
          }
        />
      </div>
      <div className="w-48">
        <label
          htmlFor="filter-event-type"
          className="block text-sm font-medium text-text-main mb-1"
        >
          Tipo de Evento
        </label>
        <select
          id="filter-event-type"
          value={filters.event_type ?? ""}
          onChange={(e) =>
            onChange({ ...filters, event_type: e.target.value || undefined, page: 1 })
          }
          className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        >
          <option value="">Todos</option>
          <option value="tool">Tool</option>
          <option value="chat">Chat</option>
        </select>
      </div>
      <Button
        variant="ghost"
        size="md"
        onClick={() =>
          onChange({ page: 1, limit: filters.limit })
        }
      >
        Limpar filtros
      </Button>
    </div>
  );
}
