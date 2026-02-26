import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, Button, Input, Modal, SlidePanel, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { McpServerResponse } from "./dtos/response/mcp-server.response";
import { useMcpServersPage } from "./hooks";

export function McpServers() {
  const {
    servers,
    isLoading,
    isError,
    connectionTypes,
    isCreateOpen,
    editingServer,
    deletingServer,
    setDeletingServer,
    formName,
    setFormName,
    formConnectionTypeId,
    setFormConnectionTypeId,
    formConfig,
    setFormConfig,
    formError,
    editName,
    setEditName,
    editConnectionTypeId,
    setEditConnectionTypeId,
    editConfig,
    setEditConfig,
    editError,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
    onCreateSubmit,
    isCreating,
    onEditSubmit,
    isUpdating,
    handleDelete,
    isDeleting,
  } = useMcpServersPage();

  const columns: ColumnDef<McpServerResponse>[] = [
    {
      id: "name",
      header: "Nome",
      accessor: (row) => <span className="font-medium text-text-main">{row.name}</span>,
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: "connection_type",
      header: "Tipo de Conexão",
      accessor: (row) => <span className="text-text-muted">{row.connection_type_name}</span>,
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
    },
    {
      id: "actions",
      header: "Ações",
      align: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip content="Editar">
            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Excluir">
            <Button variant="ghost" size="sm" onClick={() => setDeletingServer(row)}>
              <Trash2 className="w-4 h-4 text-error-text" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">MCP Servers</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Novo Server
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={servers}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar MCP servers. Tente novamente mais tarde."
        emptyMessage='Nenhum MCP server encontrado. Crie o primeiro clicando em "Novo Server".'
      />

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Novo MCP Server">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Nome"
            placeholder="Nome do server"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <div className="w-full">
            <label
              htmlFor="connection_type_id"
              className="block text-sm font-medium text-text-main mb-1"
            >
              Tipo de Conexão
            </label>
            <select
              id="connection_type_id"
              value={formConnectionTypeId}
              onChange={(e) => setFormConnectionTypeId(Number(e.target.value))}
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            >
              <option value={0}>Selecione um tipo</option>
              {connectionTypes?.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="config" className="block text-sm font-medium text-text-main mb-1">
              Config (JSON)
            </label>
            <textarea
              id="config"
              rows={5}
              placeholder='{"key": "value"}'
              value={formConfig}
              onChange={(e) => setFormConfig(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical font-mono"
            />
          </div>
          {formError && <p className="text-xs text-error-text">{formError}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseCreate}>
              Cancelar
            </Button>
            <Button type="submit" loading={isCreating}>
              Criar
            </Button>
          </div>
        </form>
      </SlidePanel>

      {/* Edit Panel */}
      <SlidePanel open={!!editingServer} onClose={handleCloseEdit} title="Editar MCP Server">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            id="edit-name"
            label="Nome"
            placeholder="Nome do server"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <div className="w-full">
            <label
              htmlFor="edit-connection_type_id"
              className="block text-sm font-medium text-text-main mb-1"
            >
              Tipo de Conexão
            </label>
            <select
              id="edit-connection_type_id"
              value={editConnectionTypeId}
              onChange={(e) => setEditConnectionTypeId(Number(e.target.value))}
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            >
              <option value={0}>Selecione um tipo</option>
              {connectionTypes?.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="edit-config" className="block text-sm font-medium text-text-main mb-1">
              Config (JSON)
            </label>
            <textarea
              id="edit-config"
              rows={5}
              placeholder='{"key": "value"}'
              value={editConfig}
              onChange={(e) => setEditConfig(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical font-mono"
            />
          </div>
          {editError && <p className="text-xs text-error-text">{editError}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseEdit}>
              Cancelar
            </Button>
            <Button type="submit" loading={isUpdating}>
              Salvar
            </Button>
          </div>
        </form>
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingServer}
        onClose={() => setDeletingServer(null)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir o server{" "}
            <span className="font-medium text-text-main">{deletingServer?.name}</span>? Essa ação
            não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingServer(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
