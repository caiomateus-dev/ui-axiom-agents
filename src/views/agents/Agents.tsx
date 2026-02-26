import { Plus } from "lucide-react";

import { Badge, Button, Input, Modal } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { AgentResponse } from "./dtos/response/agent.response";
import { useAgentsPage } from "./hooks";

const columns: ColumnDef<AgentResponse>[] = [
  {
    id: "name",
    header: "Nome",
    accessor: (row) => <span className="font-medium text-text-main">{row.name}</span>,
    sortable: true,
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => (
      <Badge variant={row.is_active ? "success" : "error"}>
        {row.is_active ? "Ativo" : "Inativo"}
      </Badge>
    ),
  },
  {
    id: "created_at",
    header: "Criado em",
    accessor: (row) => <span className="text-text-muted">{formatDate(row.created_at)}</span>,
    sortable: true,
    sortFn: (a, b) => a.created_at.localeCompare(b.created_at),
  },
];

export function Agents() {
  const {
    agents,
    isLoading,
    isError,
    isCreateOpen,
    register,
    errors,
    handleOpenCreate,
    handleCloseCreate,
    onSubmit,
    isCreating,
    navigateToAgent,
  } = useAgentsPage();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Agents</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Novo Agent
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={agents}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar agents. Tente novamente mais tarde."
        emptyMessage='Nenhum agent encontrado. Crie o primeiro clicando em "Novo Agent".'
        onRowClick={(row) => navigateToAgent(row.id)}
      />

      <Modal open={isCreateOpen} onClose={handleCloseCreate} title="Novo Agent">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            {...register("name")}
            id="name"
            label="Nome"
            placeholder="Nome do agent"
            error={errors.name?.message}
          />
          <Input
            {...register("description")}
            id="description"
            label="Descrição"
            placeholder="Descrição do agent"
            error={errors.description?.message}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseCreate}>
              Cancelar
            </Button>
            <Button type="submit" loading={isCreating}>
              Criar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
