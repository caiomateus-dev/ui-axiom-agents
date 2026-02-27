import { useState } from "react";

import { Check, Copy, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, Button, Input, Modal, SlidePanel, DataTable, Tooltip } from "@/components";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { ApiKeyResponse } from "./dtos/response/api-key.response";
import { useApiKeysPage } from "./hooks";

function ApiKeyCopyCell({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const masked = apiKey.length > 8 ? apiKey.slice(0, 4) + "..." + apiKey.slice(-4) : apiKey;

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs text-text-muted">{masked}</span>
      <button
        onClick={handleCopy}
        title="Copiar chave"
        className="p-1 rounded text-text-muted hover:text-text-main hover:bg-brand-50 transition-colors cursor-pointer"
      >
        {copied ? <Check className="w-3 h-3 text-success-text" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

export function ApiKeys() {
  const {
    apiKeys,
    isLoading,
    isError,
    applications,
    isCreateOpen,
    editingKey,
    deletingKey,
    setDeletingKey,
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
  } = useApiKeysPage();

  const columns: ColumnDef<ApiKeyResponse>[] = [
    {
      id: "name",
      header: "Nome",
      accessor: (row) => <span className="font-medium text-text-main">{row.name}</span>,
    },
    {
      id: "application",
      header: "Aplicação",
      accessor: (row) => <span className="text-text-muted">{row.application_name}</span>,
    },
    {
      id: "key",
      header: "Chave",
      accessor: (row) => <ApiKeyCopyCell apiKey={row.key} />,
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
      id: "usage",
      header: "Uso",
      accessor: (row) => <span className="text-text-muted">{row.usage_count}</span>,
    },
    {
      id: "last_used",
      header: "Último uso",
      accessor: (row) => <span className="text-text-muted">{formatDate(row.last_used_at)}</span>,
    },
    {
      id: "actions",
      header: "Ações",
      align: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip content="Editar">
            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Tooltip content="Excluir">
            <Button variant="ghost" size="sm" onClick={() => setDeletingKey(row)}>
              <Trash2 className="w-3.5 h-3.5 text-error-text" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">API Keys</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Nova API Key
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={apiKeys}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar API Keys. Tente novamente mais tarde."
        emptyMessage='Nenhuma API Key encontrada. Crie a primeira clicando em "Nova API Key".'
      />

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Nova API Key">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <div className="w-full">
            <label
              htmlFor="application_id"
              className="block text-sm font-medium text-text-main mb-1"
            >
              Aplicação
            </label>
            <select
              {...registerCreate("application_id", { valueAsNumber: true })}
              id="application_id"
              className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione uma aplicação
              </option>
              {applications?.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
            {createErrors.application_id && (
              <p className="text-xs text-error-text mt-1">{createErrors.application_id.message}</p>
            )}
          </div>
          <Input
            {...registerCreate("name")}
            id="name"
            label="Nome"
            placeholder="Nome da API Key"
            error={createErrors.name?.message}
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
      <SlidePanel open={!!editingKey} onClose={handleCloseEdit} title="Editar API Key">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            {...registerEdit("name")}
            id="edit-name"
            label="Nome"
            placeholder="Nome da API Key"
            error={editErrors.name?.message}
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
      <Modal open={!!deletingKey} onClose={() => setDeletingKey(null)} title="Confirmar Exclusão">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir a API Key{" "}
            <strong className="text-text-main">{deletingKey?.name}</strong>? Essa ação não pode ser
            desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeletingKey(null)}>
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
