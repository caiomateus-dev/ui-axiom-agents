import { useNavigate } from "react-router";

import { Pencil, Plus, Trash2, Users } from "lucide-react";

import { Badge, Button, Input, Modal, SlidePanel, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { OrganizationResponse } from "./dtos/response/organization.response";
import { useOrganizationsPage } from "./hooks";

export function Organizations() {
  const navigate = useNavigate();
  const {
    organizations,
    isLoading,
    isError,
    isCreateOpen,
    editingOrg,
    deletingOrg,
    createRegister,
    createErrors,
    editRegister,
    editErrors,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
    onCreateSubmit,
    onEditSubmit,
    handleOpenDelete,
    handleDelete,
    handleCloseDelete,
    isSubmitting,
    isDeleting,
  } = useOrganizationsPage();

  const columns: ColumnDef<OrganizationResponse>[] = [
    {
      id: "name",
      header: "Nome",
      accessor: (row) => <span className="font-medium text-text-main">{row.name}</span>,
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: "slug",
      header: "Slug",
      accessor: (row) => <span className="text-text-muted">{row.slug}</span>,
    },
    {
      id: "members",
      header: "Membros",
      accessor: (row) => <span className="text-text-muted">{row.members_count}</span>,
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
          <Tooltip content="Membros">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/organizations/${row.id}/members`)}
            >
              <Users className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Tooltip content="Editar">
            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Tooltip content="Excluir">
            <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(row)}>
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
        <h1 className="text-2xl font-bold text-text-main">Organizações</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Nova Organização
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar organizações. Tente novamente mais tarde."
        emptyMessage="Nenhuma organização encontrada."
      />

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Nova Organização">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <Input
            {...createRegister("name")}
            id="create-org-name"
            label="Nome"
            placeholder="Nome da organização"
            error={createErrors.name?.message}
          />
          <Input
            {...createRegister("slug")}
            id="create-org-slug"
            label="Slug"
            placeholder="minha-empresa"
            error={createErrors.slug?.message}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseCreate}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Criar
            </Button>
          </div>
        </form>
      </SlidePanel>

      {/* Edit Panel */}
      <SlidePanel open={!!editingOrg} onClose={handleCloseEdit} title="Editar Organização">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            {...editRegister("name")}
            id="edit-org-name"
            label="Nome"
            placeholder="Nome da organização"
            error={editErrors.name?.message}
          />
          <Input
            {...editRegister("slug")}
            id="edit-org-slug"
            label="Slug"
            placeholder="minha-empresa"
            error={editErrors.slug?.message}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...editRegister("is_active")}
              className="h-4 w-4 rounded border-border-strong text-brand-500 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-sm text-text-main">Ativo</span>
          </label>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseEdit}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deletingOrg} onClose={handleCloseDelete} title="Excluir Organização">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir a organização{" "}
            <strong className="text-text-main">{deletingOrg?.name}</strong>? Esta ação não pode ser
            desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseDelete}>
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
