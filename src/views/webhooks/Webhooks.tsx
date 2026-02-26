import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, Button, Input, Modal, SlidePanel, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { WebhookResponse } from "./dtos/response/webhook.response";
import { useWebhooksPage } from "./hooks";

export function Webhooks() {
  const {
    applicationId,
    applications,
    agents,
    handleApplicationChange,
    webhooks,
    isLoading,
    isError,
    isCreateOpen,
    editingWebhook,
    deletingWebhook,
    setDeletingWebhook,
    registerCreate,
    createErrors,
    registerEdit,
    editErrors,
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
  } = useWebhooksPage();

  const columns: ColumnDef<WebhookResponse>[] = [
    {
      id: "agent",
      header: "Agente",
      accessor: (row) => <span className="font-medium text-text-main">{row.agent_name}</span>,
    },
    {
      id: "url",
      header: "URL",
      accessor: (row) => <span className="text-text-muted max-w-xs truncate block">{row.url}</span>,
    },
    {
      id: "auth_type",
      header: "Autenticação",
      accessor: (row) => <span className="text-text-muted">{row.auth_type || "-"}</span>,
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
            <Button variant="ghost" size="sm" onClick={() => setDeletingWebhook(row)}>
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
        <h1 className="text-2xl font-bold text-text-main">Webhooks</h1>
        {applicationId > 0 && (
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Novo Webhook
          </Button>
        )}
      </div>

      {/* Application Selector */}
      <div className="mb-6 max-w-xs">
        <label
          htmlFor="application_filter"
          className="block text-sm font-medium text-text-main mb-1"
        >
          Aplicação
        </label>
        <select
          id="application_filter"
          value={applicationId || ""}
          onChange={(e) => handleApplicationChange(e.target.value)}
          className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        >
          <option value="">Selecione uma aplicação</option>
          {applications?.map((app) => (
            <option key={app.id} value={app.id}>
              {app.name}
            </option>
          ))}
        </select>
      </div>

      {applicationId === 0 ? (
        <div className="rounded-lg border border-border-subtle bg-bg-card p-10 text-center text-text-muted text-sm">
          Selecione uma aplicação para visualizar os webhooks.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={webhooks}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Erro ao carregar webhooks. Tente novamente mais tarde."
          emptyMessage="Nenhum webhook encontrado para esta aplicação."
        />
      )}

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Novo Webhook">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <div className="w-full">
            <label htmlFor="agent_id" className="block text-sm font-medium text-text-main mb-1">
              Agente
            </label>
            <select
              {...registerCreate("agent_id", { valueAsNumber: true })}
              id="agent_id"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione um agente
              </option>
              {agents?.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            {createErrors.agent_id && (
              <p className="text-xs text-error-text mt-1">{createErrors.agent_id.message}</p>
            )}
          </div>
          <Input
            {...registerCreate("url")}
            id="url"
            label="URL"
            placeholder="https://exemplo.com/webhook"
            error={createErrors.url?.message}
          />
          <Input
            {...registerCreate("auth_type")}
            id="auth_type"
            label="Tipo de Autenticação"
            placeholder="Ex: Bearer, Basic"
            error={createErrors.auth_type?.message}
          />
          <Input
            {...registerCreate("auth_token")}
            id="auth_token"
            label="Token de Autenticação"
            placeholder="Token"
            error={createErrors.auth_token?.message}
          />
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
      <SlidePanel open={!!editingWebhook} onClose={handleCloseEdit} title="Editar Webhook">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            {...registerEdit("url")}
            id="edit-url"
            label="URL"
            placeholder="https://exemplo.com/webhook"
            error={editErrors.url?.message}
          />
          <Input
            {...registerEdit("auth_type")}
            id="edit-auth_type"
            label="Tipo de Autenticação"
            placeholder="Ex: Bearer, Basic"
            error={editErrors.auth_type?.message}
          />
          <Input
            {...registerEdit("auth_token")}
            id="edit-auth_token"
            label="Token de Autenticação"
            placeholder="Token (deixe vazio para manter o atual)"
            error={editErrors.auth_token?.message}
          />
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
        open={!!deletingWebhook}
        onClose={() => setDeletingWebhook(null)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir o webhook{" "}
            <span className="font-medium text-text-main">{deletingWebhook?.url}</span>? Essa ação
            não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingWebhook(null)}>
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
