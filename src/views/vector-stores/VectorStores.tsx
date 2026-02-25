import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, Button, Input, Modal } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { VectorStoreResponse } from "./dtos/response/vector-store.response";
import { useVectorStoresPage } from "./hooks";

export function VectorStores() {
  const {
    stores,
    isLoading,
    isError,
    isCreateOpen,
    editingStore,
    deletingStore,
    setDeletingStore,
    fileInputRef,
    editFileInputRef,
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
  } = useVectorStoresPage();

  const columns: ColumnDef<VectorStoreResponse>[] = [
    {
      id: "agent",
      header: "Agent",
      accessor: (row) => <span className="font-medium text-text-main">{row.agent_name}</span>,
    },
    {
      id: "version",
      header: "Versão",
      accessor: (row) => <span className="text-text-muted">v{row.version}</span>,
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
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeletingStore(row)}>
            <Trash2 className="w-4 h-4 text-error-text" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Vector Stores</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Novo Vector Store
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={stores}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar vector stores. Tente novamente mais tarde."
        emptyMessage='Nenhum vector store encontrado. Crie o primeiro clicando em "Novo Vector Store".'
      />

      {/* Create Modal */}
      <Modal open={isCreateOpen} onClose={handleCloseCreate} title="Novo Vector Store">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <Input
            {...registerCreate("agent_id", { valueAsNumber: true })}
            id="agent_id"
            label="Agent ID"
            type="number"
            placeholder="ID do agent"
            error={createErrors.agent_id?.message}
          />
          <Input
            {...registerCreate("titulo")}
            id="titulo"
            label="Título"
            placeholder="Título do vector store"
            error={createErrors.titulo?.message}
          />
          <div className="w-full">
            <label htmlFor="descricao" className="block text-sm font-medium text-text-main mb-1">
              Descrição
            </label>
            <textarea
              {...registerCreate("descricao")}
              id="descricao"
              rows={3}
              placeholder="Descrição do vector store"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
            />
          </div>
          <div className="w-full">
            <label htmlFor="text" className="block text-sm font-medium text-text-main mb-1">
              Texto
            </label>
            <textarea
              {...registerCreate("text")}
              id="text"
              rows={4}
              placeholder="Texto para indexação"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
            />
          </div>
          <div className="w-full">
            <label htmlFor="file" className="block text-sm font-medium text-text-main mb-1">
              Arquivo
            </label>
            <input
              ref={fileInputRef}
              id="file"
              type="file"
              className="w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600 file:cursor-pointer cursor-pointer"
            />
          </div>
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

      {/* Edit Modal */}
      <Modal open={!!editingStore} onClose={handleCloseEdit} title="Editar Vector Store">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            {...registerEdit("titulo")}
            id="edit-titulo"
            label="Título"
            placeholder="Título do vector store"
            error={editErrors.titulo?.message}
          />
          <div className="w-full">
            <label
              htmlFor="edit-descricao"
              className="block text-sm font-medium text-text-main mb-1"
            >
              Descrição
            </label>
            <textarea
              {...registerEdit("descricao")}
              id="edit-descricao"
              rows={3}
              placeholder="Descrição do vector store"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
            />
          </div>
          <div className="w-full">
            <label htmlFor="edit-text" className="block text-sm font-medium text-text-main mb-1">
              Texto
            </label>
            <textarea
              {...registerEdit("text")}
              id="edit-text"
              rows={4}
              placeholder="Texto para indexação"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
            />
          </div>
          <div className="w-full">
            <label htmlFor="edit-file" className="block text-sm font-medium text-text-main mb-1">
              Arquivo
            </label>
            <input
              ref={editFileInputRef}
              id="edit-file"
              type="file"
              className="w-full text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600 file:cursor-pointer cursor-pointer"
            />
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingStore}
        onClose={() => setDeletingStore(null)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir o vector store do agent{" "}
            <span className="font-medium text-text-main">{deletingStore?.agent_name}</span>? Essa
            ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingStore(null)}>
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
