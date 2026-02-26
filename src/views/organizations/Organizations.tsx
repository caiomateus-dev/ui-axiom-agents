import { Pencil, Plus, Trash2, UserPlus, Users } from "lucide-react";

import { Badge, Button, Input, Modal } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { OrganizationMemberResponse } from "./dtos/response/organization.response";
import type { OrganizationResponse } from "./dtos/response/organization.response";
import { useOrganizationsPage } from "./hooks";

export function Organizations() {
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
    // Members
    viewingOrg,
    members,
    isMembersLoading,
    isInviteOpen,
    removingMember,
    inviteRegister,
    inviteErrors,
    handleViewMembers,
    handleCloseMembers,
    handleOpenInvite,
    handleCloseInvite,
    onInviteSubmit,
    handleOpenRemoveMember,
    handleRemoveMember,
    handleCloseRemoveMember,
    isInviting,
    isRemoving,
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
      header: "Acoes",
      align: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleViewMembers(row)}>
            <Users className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(row)}>
            <Trash2 className="w-3.5 h-3.5 text-error-text" />
          </Button>
        </div>
      ),
    },
  ];

  const memberColumns: ColumnDef<OrganizationMemberResponse>[] = [
    {
      id: "name",
      header: "Nome",
      accessor: (row) => <span className="font-medium text-text-main">{row.user_name}</span>,
    },
    {
      id: "email",
      header: "E-mail",
      accessor: (row) => <span className="text-text-muted">{row.user_email}</span>,
    },
    {
      id: "role",
      header: "Role",
      accessor: (row) => (
        <Badge variant={row.role === "admin" ? "warning" : "info"}>{row.role}</Badge>
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
      header: "Desde",
      accessor: (row) => <span className="text-text-muted">{formatDate(row.created_at)}</span>,
    },
    {
      id: "actions",
      header: "Acoes",
      align: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleOpenRemoveMember(row)}>
            <Trash2 className="w-3.5 h-3.5 text-error-text" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Organizations</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Nova Organizacao
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar organizacoes. Tente novamente mais tarde."
        emptyMessage="Nenhuma organizacao encontrada."
      />

      {/* Create Modal */}
      <Modal open={isCreateOpen} onClose={handleCloseCreate} title="Nova Organizacao">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <Input
            {...createRegister("name")}
            id="create-org-name"
            label="Nome"
            placeholder="Nome da organizacao"
            error={createErrors.name?.message}
          />
          <Input
            {...createRegister("slug")}
            id="create-org-slug"
            label="Slug"
            placeholder="minha-empresa"
            error={createErrors.slug?.message}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseCreate}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Criar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingOrg} onClose={handleCloseEdit} title="Editar Organizacao">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            {...editRegister("name")}
            id="edit-org-name"
            label="Nome"
            placeholder="Nome da organizacao"
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
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseEdit}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deletingOrg} onClose={handleCloseDelete} title="Excluir Organizacao">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir a organizacao{" "}
            <strong className="text-text-main">{deletingOrg?.name}</strong>? Esta acao nao pode ser
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

      {/* Members Modal */}
      <Modal
        open={!!viewingOrg}
        onClose={handleCloseMembers}
        title={`Membros - ${viewingOrg?.name ?? ""}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {members.length} membro{members.length !== 1 ? "s" : ""}
            </p>
            <Button size="sm" onClick={handleOpenInvite}>
              <UserPlus className="w-4 h-4" />
              Convidar
            </Button>
          </div>

          <DataTable
            columns={memberColumns}
            data={members}
            rowKey={(row) => row.id}
            isLoading={isMembersLoading}
            isError={false}
            emptyMessage="Nenhum membro encontrado."
          />
        </div>
      </Modal>

      {/* Invite Member Modal */}
      <Modal open={isInviteOpen} onClose={handleCloseInvite} title="Convidar Membro">
        <form onSubmit={onInviteSubmit} className="flex flex-col gap-4">
          <Input
            {...inviteRegister("name")}
            id="invite-name"
            label="Nome"
            placeholder="Nome do membro"
            error={inviteErrors.name?.message}
          />
          <Input
            {...inviteRegister("email")}
            id="invite-email"
            label="E-mail"
            placeholder="email@exemplo.com"
            error={inviteErrors.email?.message}
          />
          <Input
            {...inviteRegister("password")}
            id="invite-password"
            label="Senha"
            type="password"
            placeholder="Minimo 6 caracteres"
            error={inviteErrors.password?.message}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="invite-role" className="text-sm font-medium text-text-main">
              Role
            </label>
            <select
              {...inviteRegister("role")}
              id="invite-role"
              className="rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            {inviteErrors.role?.message && (
              <span className="text-xs text-error-text">{inviteErrors.role.message}</span>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseInvite}>
              Cancelar
            </Button>
            <Button type="submit" loading={isInviting}>
              Convidar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove Member Confirmation Modal */}
      <Modal open={!!removingMember} onClose={handleCloseRemoveMember} title="Remover Membro">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja remover{" "}
            <strong className="text-text-main">{removingMember?.user_name}</strong> da organizacao?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleCloseRemoveMember}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleRemoveMember} loading={isRemoving}>
              Remover
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
