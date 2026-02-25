import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useToast } from "@/contexts/ToastContext";
import { useApplications } from "@/views/applications/hooks/use-applications";

import type { ApiKeyFormData } from "../dtos/request/api-key.schema";
import { apiKeySchema } from "../dtos/request/api-key.schema";
import type { ApiKeyResponse } from "../dtos/response/api-key.response";
import { useApiKeys, useCreateApiKey, useDeleteApiKey, useUpdateApiKey } from "./use-api-keys";

export function useApiKeysPage() {
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKeyResponse | null>(null);
  const [deletingKey, setDeletingKey] = useState<ApiKeyResponse | null>(null);

  const { data: apiKeys, isLoading, isError } = useApiKeys();
  const { data: applications } = useApplications();
  const createApiKey = useCreateApiKey();
  const updateApiKey = useUpdateApiKey();
  const deleteApiKey = useDeleteApiKey();

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
  });

  function handleOpenCreate() {
    resetCreate();
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    resetCreate();
  }

  function handleOpenEdit(apiKey: ApiKeyResponse) {
    resetEdit({
      application_id: apiKey.application_id,
      name: apiKey.name,
    });
    setEditingKey(apiKey);
  }

  function handleCloseEdit() {
    setEditingKey(null);
    resetEdit();
  }

  const onCreateSubmit = handleCreateSubmit(async (data) => {
    try {
      await createApiKey.mutateAsync({ ...data, is_active: true });
      toast.success("API Key criada com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar API Key");
    }
  });

  const onEditSubmit = handleEditSubmit(async (data) => {
    if (!editingKey) return;
    try {
      await updateApiKey.mutateAsync({ id: editingKey.id, data });
      toast.success("API Key atualizada com sucesso");
      handleCloseEdit();
    } catch {
      toast.error("Erro ao atualizar API Key");
    }
  });

  async function handleDelete() {
    if (!deletingKey) return;
    try {
      await deleteApiKey.mutateAsync(deletingKey.id);
      toast.success("API Key excluída com sucesso");
      setDeletingKey(null);
    } catch {
      toast.error("Erro ao excluir API Key");
    }
  }

  return {
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
    isCreating: createApiKey.isPending,
    onEditSubmit,
    isUpdating: updateApiKey.isPending,
    handleDelete,
    isDeleting: deleteApiKey.isPending,
  };
}
