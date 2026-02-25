import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useToast } from "@/contexts/ToastContext";

import type { CreateUserFormData } from "../dtos/request/user.schema";
import { createUserSchema, updateUserSchema } from "../dtos/request/user.schema";
import type { UpdateUserFormData } from "../dtos/request/user.schema";
import type { UserResponse } from "../dtos/response/user.response";
import {
  useBlockUser,
  useCreateUser,
  useDeleteUser,
  useUnblockUser,
  useUpdateUser,
  useUsers,
} from "./use-users";

export function useUsersPage() {
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const { data, isLoading, isError } = useUsers(page, limit, search || undefined);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();

  const createForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const editForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  function handleOpenCreate() {
    createForm.reset({ email: "", password: "", name: "", is_staff: false, is_superuser: false });
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    createForm.reset();
  }

  function handleOpenEdit(user: UserResponse) {
    setEditingUser(user);
    editForm.reset({
      email: user.email,
      name: user.name,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
    });
  }

  function handleCloseEdit() {
    setEditingUser(null);
    editForm.reset();
  }

  const onCreateSubmit = createForm.handleSubmit(async (formData) => {
    try {
      await createUserMutation.mutateAsync(formData);
      toast.success("Usuário criado com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar usuário");
    }
  });

  const onEditSubmit = editForm.handleSubmit(async (formData) => {
    if (editingUser) {
      try {
        await updateUserMutation.mutateAsync({ id: editingUser.id, data: formData });
        toast.success("Usuário atualizado com sucesso");
        handleCloseEdit();
      } catch {
        toast.error("Erro ao atualizar usuário");
      }
    }
  });

  function handleOpenDelete(user: UserResponse) {
    setDeletingUser(user);
  }

  async function handleDelete() {
    if (deletingUser) {
      try {
        await deleteUserMutation.mutateAsync(deletingUser.id);
        toast.success("Usuário excluído com sucesso");
        setDeletingUser(null);
      } catch {
        toast.error("Erro ao excluir usuário");
      }
    }
  }

  function handleCloseDelete() {
    setDeletingUser(null);
  }

  async function handleBlock(user: UserResponse) {
    try {
      await blockUserMutation.mutateAsync(user.id);
      toast.success("Usuário bloqueado com sucesso");
    } catch {
      toast.error("Erro ao bloquear usuário");
    }
  }

  async function handleUnblock(user: UserResponse) {
    try {
      await unblockUserMutation.mutateAsync(user.id);
      toast.success("Usuário desbloqueado com sucesso");
    } catch {
      toast.error("Erro ao desbloquear usuário");
    }
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;

  return {
    users: data?.items,
    totalPages: data?.total_pages ?? 1,
    page,
    isLoading,
    isError,
    search,
    isCreateOpen,
    editingUser,
    deletingUser,
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
    handleBlock,
    handleUnblock,
    handleSearch,
    handlePageChange,
    isSubmitting,
    isDeleting: deleteUserMutation.isPending,
    isBlocking: blockUserMutation.isPending,
    isUnblocking: unblockUserMutation.isPending,
  };
}
