import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/contexts/ToastContext";

import type { CreateOrganizationFormData } from "../dtos/request/organization.schema";
import {
  createOrganizationSchema,
  inviteMemberSchema,
  updateOrganizationSchema,
} from "../dtos/request/organization.schema";
import type { InviteMemberFormData } from "../dtos/request/organization.schema";
import type { UpdateOrganizationFormData } from "../dtos/request/organization.schema";
import type { OrganizationMemberResponse } from "../dtos/response/organization.response";
import type { OrganizationResponse } from "../dtos/response/organization.response";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useInviteMember,
  useOrganizationMembers,
  useOrganizations,
  useRemoveMember,
  useUpdateOrganization,
} from "./use-organizations";

export function useOrganizationsPage() {
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationResponse | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<OrganizationResponse | null>(null);
  const [viewingOrg, setViewingOrg] = useState<OrganizationResponse | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [removingMember, setRemovingMember] = useState<OrganizationMemberResponse | null>(null);

  const { data: organizations, isLoading, isError } = useOrganizations();
  const { data: members, isLoading: isMembersLoading } = useOrganizationMembers(
    viewingOrg?.id ?? null,
  );
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();
  const inviteMutation = useInviteMember();
  const removeMemberMutation = useRemoveMember();

  const createForm = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const editForm = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
  });

  const inviteForm = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
  });

  // ─── Org CRUD ──────────────────────────────────────────────────

  function handleOpenCreate() {
    createForm.reset({ name: "", slug: "", is_active: true });
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    createForm.reset();
  }

  function handleOpenEdit(org: OrganizationResponse) {
    setEditingOrg(org);
    editForm.reset({
      name: org.name,
      slug: org.slug,
      is_active: org.is_active,
    });
  }

  function handleCloseEdit() {
    setEditingOrg(null);
    editForm.reset();
  }

  const onCreateSubmit = createForm.handleSubmit(async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Organizacao criada com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar organizacao");
    }
  });

  const onEditSubmit = editForm.handleSubmit(async (formData) => {
    if (editingOrg) {
      try {
        await updateMutation.mutateAsync({ id: editingOrg.id, data: formData });
        toast.success("Organizacao atualizada com sucesso");
        handleCloseEdit();
      } catch {
        toast.error("Erro ao atualizar organizacao");
      }
    }
  });

  function handleOpenDelete(org: OrganizationResponse) {
    setDeletingOrg(org);
  }

  async function handleDelete() {
    if (deletingOrg) {
      try {
        await deleteMutation.mutateAsync(deletingOrg.id);
        toast.success("Organizacao excluida com sucesso");
        setDeletingOrg(null);
      } catch {
        toast.error("Erro ao excluir organizacao");
      }
    }
  }

  function handleCloseDelete() {
    setDeletingOrg(null);
  }

  // ─── Members ───────────────────────────────────────────────────

  function handleViewMembers(org: OrganizationResponse) {
    setViewingOrg(org);
  }

  function handleCloseMembers() {
    setViewingOrg(null);
    setIsInviteOpen(false);
    inviteForm.reset();
  }

  function handleOpenInvite() {
    inviteForm.reset({ email: "", name: "", password: "", role: "member" });
    setIsInviteOpen(true);
  }

  function handleCloseInvite() {
    setIsInviteOpen(false);
    inviteForm.reset();
  }

  const onInviteSubmit = inviteForm.handleSubmit(async (formData) => {
    if (viewingOrg) {
      try {
        await inviteMutation.mutateAsync({ orgId: viewingOrg.id, data: formData });
        toast.success("Membro convidado com sucesso");
        handleCloseInvite();
      } catch {
        toast.error("Erro ao convidar membro");
      }
    }
  });

  function handleOpenRemoveMember(member: OrganizationMemberResponse) {
    setRemovingMember(member);
  }

  async function handleRemoveMember() {
    if (viewingOrg && removingMember) {
      try {
        await removeMemberMutation.mutateAsync({
          orgId: viewingOrg.id,
          userId: removingMember.user_id,
        });
        toast.success("Membro removido com sucesso");
        setRemovingMember(null);
      } catch {
        toast.error("Erro ao remover membro");
      }
    }
  }

  function handleCloseRemoveMember() {
    setRemovingMember(null);
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    organizations: organizations ?? [],
    isLoading,
    isError,
    // Org CRUD
    isCreateOpen,
    editingOrg,
    deletingOrg,
    createRegister: createForm.register,
    createErrors: createForm.formState.errors,
    editRegister: editForm.register,
    editErrors: editForm.formState.errors,
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
    isDeleting: deleteMutation.isPending,
    // Members
    viewingOrg,
    members: members ?? [],
    isMembersLoading,
    isInviteOpen,
    removingMember,
    inviteRegister: inviteForm.register,
    inviteErrors: inviteForm.formState.errors,
    handleViewMembers,
    handleCloseMembers,
    handleOpenInvite,
    handleCloseInvite,
    onInviteSubmit,
    handleOpenRemoveMember,
    handleRemoveMember,
    handleCloseRemoveMember,
    isInviting: inviteMutation.isPending,
    isRemoving: removeMemberMutation.isPending,
  };
}
