import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, Button, Input, Modal } from "@/components";
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
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row)} disabled={isDeleting}>
            <Trash2 className="w-3.5 h-3.5 text-error-text" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Applications</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Nova Application
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar applications. Tente novamente mais tarde."
        emptyMessage='Nenhuma application encontrada. Crie a primeira clicando em "Nova Application".'
      />

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Editar Application" : "Nova Application"}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            {...register("name")}
            id="name"
            label="Nome"
            placeholder="Nome da application"
            error={errors.name?.message}
          />
          <Input
            {...register("description")}
            id="description"
            label="Descrição"
            placeholder="Descrição da application"
            error={errors.description?.message}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingItem ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
