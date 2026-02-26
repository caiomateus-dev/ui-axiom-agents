import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, Button, Input, SlidePanel, Tooltip } from "@/components";
import type { ColumnDef } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { ApplicationResponse } from "./dtos/response/application.response";
import { useApplicationsPage } from "./hooks";

export function Applications() {
  const {
    applications,
    isLoading,
    isError,
    isModalOpen,
    editingItem,
    register,
    errors,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    onSubmit,
    isSubmitting,
    handleDelete,
    isDeleting,
    isAllOrgs,
    organizations,
    selectedOrgId,
    setSelectedOrgId,
  } = useApplicationsPage();

  const columns: ColumnDef<ApplicationResponse>[] = [
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
        <div className="flex items-center justify-end gap-1">
          <Tooltip content="Editar">
            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Tooltip content="Excluir">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row)}
              disabled={isDeleting}
            >
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
        <h1 className="text-2xl font-bold text-text-main">Aplicações</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Nova Aplicação
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar aplicações. Tente novamente mais tarde."
        emptyMessage='Nenhuma aplicação encontrada. Crie a primeira clicando em "Nova Aplicação".'
      />

      <SlidePanel
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Editar Aplicação" : "Nova Aplicação"}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {isAllOrgs && !editingItem && (
            <div className="w-full">
              <label className="block text-sm font-medium text-text-main mb-1">Organização</label>
              <select
                value={selectedOrgId ?? ""}
                onChange={(e) => setSelectedOrgId(Number(e.target.value))}
                className="w-full rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              >
                <option value="" disabled>
                  Selecione uma organização
                </option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Input
            {...register("name")}
            id="name"
            label="Nome"
            placeholder="Nome da aplicação"
            error={errors.name?.message}
          />
          <Input
            {...register("description")}
            id="description"
            label="Descrição"
            placeholder="Descrição da aplicação"
            error={errors.description?.message}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingItem ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </SlidePanel>
    </div>
  );
}
