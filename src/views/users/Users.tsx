import { Lock, Pencil, Plus, Search, Trash2, Unlock } from "lucide-react";

import { Badge, Button, Input, Modal, SlidePanel, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import type { UserResponse } from "./dtos/response/user.response";
import { useUsersPage } from "./hooks";

export function Users() {
  const {
    users,
    totalPages,
    page,
    isLoading,
    isError,
    search,
    isCreateOpen,
    editingUser,
    deletingUser,
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
    handleBlock,
    handleUnblock,
    handleSearch,
    handlePageChange,
    isSubmitting,
    isDeleting,
    isBlocking,
    isUnblocking,
  } = useUsersPage();

  const columns: ColumnDef<UserResponse>[] = [
    {
      id: "name",
      header: "Nome",
      accessor: (row) => <span className="font-medium text-text-main">{row.name}</span>,
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: "email",
      header: "E-mail",
      accessor: (row) => <span className="text-text-muted">{row.email}</span>,
    },
    {
      id: "profile",
      header: "Perfil",
      accessor: (row) => (
        <div className="flex items-center gap-1">
          {row.is_superuser && <Badge variant="warning">Superuser</Badge>}
          {row.is_staff && !row.is_superuser && <Badge variant="info">Staff</Badge>}
          {!row.is_staff && !row.is_superuser && <Badge variant="info">Usuário</Badge>}
        </div>
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
      id: "last_login",
      header: "Último Login",
      accessor: (row) => <span className="text-text-muted">{formatDate(row.last_login)}</span>,
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
          {row.is_active ? (
            <Tooltip content="Bloquear">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBlock(row)}
                disabled={isBlocking}
              >
                <Lock className="w-3.5 h-3.5 text-warning-text" />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="Desbloquear">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnblock(row)}
                disabled={isUnblocking}
              >
                <Unlock className="w-3.5 h-3.5 text-success-text" />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Excluir">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenDelete(row)}
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
        <h1 className="text-2xl font-bold text-text-main">Usuários</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full rounded-lg border border-border-strong bg-bg-card pl-9 pr-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Erro ao carregar usuários. Tente novamente mais tarde."
        emptyMessage="Nenhum usuário encontrado."
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Panel */}
      <SlidePanel open={isCreateOpen} onClose={handleCloseCreate} title="Novo Usuário">
        <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
          <Input
            {...createRegister("name")}
            id="create-name"
            label="Nome"
            placeholder="Nome do usuário"
            error={createErrors.name?.message}
          />
          <Input
            {...createRegister("email")}
            id="create-email"
            label="E-mail"
            placeholder="email@exemplo.com"
            error={createErrors.email?.message}
          />
          <Input
            {...createRegister("password")}
            id="create-password"
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            error={createErrors.password?.message}
          />
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...createRegister("is_staff")}
                className="h-4 w-4 rounded border-border-strong text-brand-500 focus:ring-brand-500 cursor-pointer"
              />
              <span className="text-sm text-text-main">Staff</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...createRegister("is_superuser")}
                className="h-4 w-4 rounded border-border-strong text-brand-500 focus:ring-brand-500 cursor-pointer"
              />
              <span className="text-sm text-text-main">Superuser</span>
            </label>
          </div>
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
      <SlidePanel open={!!editingUser} onClose={handleCloseEdit} title="Editar Usuário">
        <form onSubmit={onEditSubmit} className="flex flex-col gap-4">
          <Input
            {...editRegister("name")}
            id="edit-name"
            label="Nome"
            placeholder="Nome do usuário"
            error={editErrors.name?.message}
          />
          <Input
            {...editRegister("email")}
            id="edit-email"
            label="E-mail"
            placeholder="email@exemplo.com"
            error={editErrors.email?.message}
          />
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...editRegister("is_staff")}
                className="h-4 w-4 rounded border-border-strong text-brand-500 focus:ring-brand-500 cursor-pointer"
              />
              <span className="text-sm text-text-main">Staff</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...editRegister("is_superuser")}
                className="h-4 w-4 rounded border-border-strong text-brand-500 focus:ring-brand-500 cursor-pointer"
              />
              <span className="text-sm text-text-main">Superuser</span>
            </label>
          </div>
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
      <Modal open={!!deletingUser} onClose={handleCloseDelete} title="Excluir Usuário">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja excluir o usuário{" "}
            <strong className="text-text-main">{deletingUser?.name}</strong>? Esta ação não pode ser
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
