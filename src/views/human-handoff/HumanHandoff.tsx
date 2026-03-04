import { useState } from "react";

import { UserCheck } from "lucide-react";

import { Badge, Button, Modal } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { HandoffSessionItem } from "./dtos/response/handoff.response";
import { useHandoffPage } from "./hooks";

function formatPhone(ref: string | null): string {
  if (!ref) return "—";
  const digits = ref.replace(/\D/g, "");
  // Brazilian mobile: 55 + 2-digit area + 9-digit number = 13 digits
  if (digits.length === 13 && digits.startsWith("55")) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  // Brazilian landline: 55 + 2-digit area + 8-digit number = 12 digits
  if (digits.length === 12 && digits.startsWith("55")) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`;
  }
  return ref;
}

function ReasonCell({ reason }: { reason: string | null }) {
  const [expanded, setExpanded] = useState(false);
  if (!reason) return <span className="text-text-muted">—</span>;
  const isLong = reason.length > 60;
  return (
    <span
      className={`text-sm text-text-muted ${isLong ? "cursor-pointer hover:text-text-main transition-colors" : ""} ${expanded ? "whitespace-normal" : "truncate max-w-xs block"}`}
      onClick={isLong ? () => setExpanded((v) => !v) : undefined}
      title={isLong && !expanded ? reason : undefined}
    >
      {reason}
    </span>
  );
}

export function HumanHandoff() {
  const {
    sessions,
    total,
    isLoading,
    isError,
    releasingSession,
    handleOpenRelease,
    handleCloseRelease,
    handleConfirmRelease,
    isReleasing,
  } = useHandoffPage();

  const columns: ColumnDef<HandoffSessionItem>[] = [
    {
      id: "external_ref",
      header: "Contato",
      accessor: (row) => (
        <span className="font-medium text-text-main">{formatPhone(row.external_ref)}</span>
      ),
    },
    {
      id: "agent_name",
      header: "Agente",
      accessor: (row) => <span className="text-text-muted">{row.agent_name}</span>,
    },
    {
      id: "handoff_reason",
      header: "Motivo",
      accessor: (row) => <ReasonCell reason={row.handoff_reason} />,
    },
    {
      id: "status",
      header: "Status",
      accessor: () => <Badge variant="warning">Aguardando atendimento</Badge>,
    },
    {
      id: "updated_at",
      header: "Última atividade",
      accessor: (row) => <span className="text-text-muted">{formatDate(row.updated_at)}</span>,
      sortable: true,
      sortFn: (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    },
    {
      id: "actions",
      header: "Ações",
      align: "right",
      accessor: (row) => (
        <Button variant="secondary" size="sm" onClick={() => handleOpenRelease(row)}>
          <UserCheck className="w-4 h-4" />
          Liberar
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Atendimento Humano</h1>
          <p className="text-sm text-text-muted mt-1">
            Sessões aguardando liberação para retomar o atendimento do agente.
          </p>
        </div>
        {total > 0 && <Badge variant="warning">{total} aguardando</Badge>}
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        rowKey={(row) => row.session_id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar sessões. Tente novamente mais tarde."
        emptyMessage="Nenhuma sessão em atendimento humano no momento."
      />

      <Modal
        open={!!releasingSession}
        onClose={handleCloseRelease}
        title="Liberar Atendimento Humano"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja liberar a sessão de{" "}
            <span className="font-medium text-text-main">
              {formatPhone(releasingSession?.external_ref ?? null) !== "—"
                ? formatPhone(releasingSession?.external_ref ?? null)
                : releasingSession?.session_id}
            </span>
            ? O agente{" "}
            <span className="font-medium text-text-main">{releasingSession?.agent_name}</span>{" "}
            voltará a responder as mensagens desta conversa.
          </p>
          {releasingSession?.handoff_reason && (
            <div className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2">
              <p className="text-xs text-text-muted mb-1">Motivo do encaminhamento</p>
              <p className="text-sm text-text-main">{releasingSession.handoff_reason}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={handleCloseRelease} disabled={isReleasing}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmRelease} loading={isReleasing}>
              <UserCheck className="w-4 h-4" />
              Liberar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
