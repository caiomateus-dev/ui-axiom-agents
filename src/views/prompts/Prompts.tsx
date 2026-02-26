import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, Button, Input, Modal, SlidePanel, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate, truncate } from "@/utils";

import type { PromptResponse } from "./dtos/response/prompt.response";
import { usePromptsPage } from "./hooks";

export function Prompts() {
  const {
    prompts,
    isLoading,
    isError,
    isCreateOpen,
    editingPrompt,
    deletingPrompt,
    setDeletingPrompt,
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
  } = usePromptsPage();

  const columns: ColumnDef<PromptResponse>[] = [
    {
      id: "agent",
      header: "Agente",
      accessor: (row) => <span className="font-medium text-text-main">{row.agent_name}</span>,
    },
    {
      id: "version",
      header: "Versão",
      accessor: (row) => <span className="text-text-muted">v{row.version}</span>,
    },
    {
      id: "prompt",
      header: "Prompt",
      accessor: (row) => (
        <span className="text-text-muted max-w-xs block">{truncate(row.prompt, 80)}</span>
      ),
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
            <Button variant="ghost" size="sm" onClick={() => setDeletingPrompt(row)}>
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
        <h1 className="text-2xl font-bold text-text-main">Prompts</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Novo Prompt
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={prompts}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar prompts. Tente novamente mais tarde."
        emptyMessage='Nenhum prompt encontrado. Crie o primeiro clicando em "Novo Prompt".'
      />

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Novo Prompt" size="lg">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <Input
            {...registerCreate("agent_id", { valueAsNumber: true })}
            id="agent_id"
            label="Agente"
            type="number"
            placeholder="ID do agente"
            error={createErrors.agent_id?.message}
          />
          <div className="w-full">
            <label htmlFor="prompt" className="block text-sm font-medium text-text-main mb-1">
              Prompt
            </label>
            <textarea
              {...registerCreate("prompt")}
              id="prompt"
              rows={12}
              placeholder="Conteúdo do prompt"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
            />
            {createErrors.prompt && (
              <p className="text-xs text-error-text mt-1">{createErrors.prompt.message}</p>
            )}
          </div>
          <Input
            {...registerCreate("description")}
            id="description"
            label="Descrição"
            placeholder="Descrição do prompt"
            error={createErrors.description?.message}
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
      <SlidePanel open={!!editingPrompt} onClose={handleCloseEdit} title="Editar Prompt" size="lg">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <div className="w-full">
            <label htmlFor="edit-prompt" className="block text-sm font-medium text-text-main mb-1">
              Prompt
            </label>
            <textarea
              {...registerEdit("prompt")}
              id="edit-prompt"
              rows={12}
              placeholder="Conteúdo do prompt"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
            />
            {editErrors.prompt && (
              <p className="text-xs text-error-text mt-1">{editErrors.prompt.message}</p>
            )}
          </div>
          <Input
            {...registerEdit("description")}
            id="edit-description"
            label="Descrição"
            placeholder="Descrição do prompt"
            error={editErrors.description?.message}
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
        open={!!deletingPrompt}
        onClose={() => setDeletingPrompt(null)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir o prompt do agente{" "}
            <span className="font-medium text-text-main">{deletingPrompt?.agent_name}</span>? Essa
            ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingPrompt(null)}>
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
