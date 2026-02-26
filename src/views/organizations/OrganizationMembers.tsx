import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Link, Trash2, UserPlus } from "lucide-react";

import { useToast } from "@/contexts/ToastContext";

import { Badge, Button, Input, Modal, Spinner, Tooltip } from "@/components";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@/components/ui/DataTable";

import { formatDate } from "@/utils";

import { inviteMemberSchema } from "./dtos/request/organization.schema";
import type { InviteMemberFormData } from "./dtos/request/organization.schema";
import type { OrganizationMemberResponse } from "./dtos/response/organization.response";
import {
  useAddMember,
  useInviteMember,
  useOrganizationMembers,
  useOrganizations,
  useRemoveMember,
} from "./hooks/use-organizations";

export function OrganizationMembers() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const orgId = Number(id);

  const { data: organizations } = useOrganizations();
  const org = organizations?.find((o) => o.id === orgId);
  const { data: members, isLoading } = useOrganizationMembers(orgId || null);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addUserId, setAddUserId] = useState("");
  const [addRole, setAddRole] = useState("member");
  const [removingMember, setRemovingMember] = useState<OrganizationMemberResponse | null>(null);

  const inviteMutation = useInviteMember();
  const addMemberMutation = useAddMember();
  const removeMutation = useRemoveMember();

  const inviteForm = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
  });

  function handleOpenInvite() {
    inviteForm.reset({ email: "", name: "", password: "", role: "member" });
    setIsAddOpen(false);
    setIsInviteOpen(true);
  }

  function handleCloseInvite() {
    setIsInviteOpen(false);
    inviteForm.reset();
  }

  function handleOpenAdd() {
    setIsInviteOpen(false);
    setAddUserId("");
    setAddRole("member");
    setIsAddOpen(true);
  }

  function handleCloseAdd() {
    setIsAddOpen(false);
    setAddUserId("");
    setAddRole("member");
  }

  async function onAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const userId = Number(addUserId);
    if (!userId || userId <= 0) {
      toast.error("ID do usuario invalido");
      return;
    }
    try {
      await addMemberMutation.mutateAsync({ orgId, data: { user_id: userId, role: addRole } });
      toast.success("Membro adicionado com sucesso");
      handleCloseAdd();
    } catch {
      toast.error("Erro ao adicionar membro");
    }
  }

  const onInviteSubmit = inviteForm.handleSubmit(async (formData) => {
    try {
      await inviteMutation.mutateAsync({ orgId, data: formData });
      toast.success("Membro convidado com sucesso");
      handleCloseInvite();
    } catch {
      toast.error("Erro ao convidar membro");
    }
  });

  async function handleRemoveMember() {
    if (removingMember) {
      try {
        await removeMutation.mutateAsync({ orgId, userId: removingMember.user_id });
        toast.success("Membro removido com sucesso");
        setRemovingMember(null);
      } catch {
        toast.error("Erro ao remover membro");
      }
    }
  }

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
          <Tooltip content="Remover">
            <Button variant="ghost" size="sm" onClick={() => setRemovingMember(row)}>
              <Trash2 className="w-3.5 h-3.5 text-error-text" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/organizations")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Membros {org ? `- ${org.name}` : ""}
          </h1>
          <p className="text-sm text-text-muted">
            {(members ?? []).length} membro{(members ?? []).length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" onClick={handleOpenAdd}>
            <Link className="w-4 h-4" />
            Adicionar existente
          </Button>
          <Button onClick={handleOpenInvite}>
            <UserPlus className="w-4 h-4" />
            Convidar novo
          </Button>
        </div>
      </div>

      {/* Add existing user form */}
      {isAddOpen && (
        <div className="rounded-lg border border-border-subtle bg-bg-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-main mb-4">Adicionar usuario existente</h3>
          <form onSubmit={onAddSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="add-user-id"
                label="ID do Usuario"
                type="number"
                placeholder="Ex: 1"
                value={addUserId}
                onChange={(e) => setAddUserId(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="add-role" className="text-sm font-medium text-text-main">
                  Role
                </label>
                <select
                  id="add-role"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className="rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={handleCloseAdd}>
                Cancelar
              </Button>
              <Button type="submit" loading={addMemberMutation.isPending}>
                Adicionar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Invite form inline */}
      {isInviteOpen && (
        <div className="rounded-lg border border-border-subtle bg-bg-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-main mb-4">Convidar Membro</h3>
          <form onSubmit={onInviteSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...inviteForm.register("name")}
                id="invite-name"
                label="Nome"
                placeholder="Nome do membro"
                error={inviteForm.formState.errors.name?.message}
              />
              <Input
                {...inviteForm.register("email")}
                id="invite-email"
                label="E-mail"
                placeholder="email@exemplo.com"
                error={inviteForm.formState.errors.email?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...inviteForm.register("password")}
                id="invite-password"
                label="Senha"
                type="password"
                placeholder="Minimo 6 caracteres"
                error={inviteForm.formState.errors.password?.message}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="invite-role" className="text-sm font-medium text-text-main">
                  Role
                </label>
                <select
                  {...inviteForm.register("role")}
                  id="invite-role"
                  className="rounded-lg border border-border-strong bg-bg-card px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                {inviteForm.formState.errors.role?.message && (
                  <span className="text-xs text-error-text">
                    {inviteForm.formState.errors.role.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={handleCloseInvite}>
                Cancelar
              </Button>
              <Button type="submit" loading={inviteMutation.isPending}>
                Convidar
              </Button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        columns={memberColumns}
        data={members ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={false}
        emptyMessage="Nenhum membro encontrado."
      />

      {/* Remove Member Confirmation Modal */}
      <Modal open={!!removingMember} onClose={() => setRemovingMember(null)} title="Remover Membro">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza que deseja remover{" "}
            <strong className="text-text-main">{removingMember?.user_name}</strong> da organizacao?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setRemovingMember(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveMember}
              loading={removeMutation.isPending}
            >
              Remover
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
