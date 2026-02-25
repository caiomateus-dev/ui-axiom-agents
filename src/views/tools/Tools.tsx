import { Pencil, RefreshCw } from "lucide-react";

import { Badge, Button, Input, Modal } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { ToolResponse } from "./dtos/response/tool.response";
import { useToolsPage } from "./hooks";

export function Tools() {
  const {
    tools,
    isLoading,
    isError,
    editingTool,
    registerEdit,
    editErrors,
    handleSync,
    isSyncing,
    handleOpenEdit,
    handleCloseEdit,
    onEditSubmit,
    isUpdating,
  } = useToolsPage();

  const columns: ColumnDef<ToolResponse>[] = [
    {
      id: "name",
      header: "Nome",
      accessor: (row) => <span className="font-medium text-text-main">{row.name}</span>,
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: "description",
      header: "Descrição",
      accessor: (row) => (
        <span className="text-text-muted max-w-xs truncate block">{row.description || "-"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.is_active ? "success" : "error"}>
          {row.is_active ? "Ativa" : "Inativa"}
        </Badge>
      ),
    },
    {
      id: "created_at",
      header: "Criado em",
      accessor: (row) => <span className="text-text-muted">{formatDate(row.created_at)}</span>,
    },
    {
      id: "actions",
      header: "Ações",
      align: "right",
      accessor: (row) => (
        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
          <Pencil className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Tools</h1>
        <Button variant="secondary" onClick={handleSync} loading={isSyncing}>
          <RefreshCw className="w-4 h-4" />
          Sincronizar
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tools}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar tools. Tente novamente mais tarde."
        emptyMessage='Nenhuma tool encontrada. Clique em "Sincronizar" para importar do registro.'
      />

      {/* Edit Modal */}
      <Modal open={!!editingTool} onClose={handleCloseEdit} title="Editar Tool">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            {...registerEdit("name")}
            id="edit-name"
            label="Nome"
            placeholder="Nome da tool"
            error={editErrors.name?.message}
          />
          <div className="w-full">
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-text-main mb-1"
            >
              Descrição
            </label>
            <textarea
              {...registerEdit("description")}
              id="edit-description"
              rows={4}
              placeholder="Descrição da tool"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
            />
            {editErrors.description && (
              <p className="text-xs text-error-text mt-1">{editErrors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseEdit}>
              Cancelar
            </Button>
            <Button type="submit" loading={isUpdating}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
