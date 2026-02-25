import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/contexts/ToastContext";

import { useApplications } from "@/views/applications/hooks/use-applications";

import type { WebhookFormData } from "../dtos/request/webhook.schema";
import { webhookSchema } from "../dtos/request/webhook.schema";
import type { WebhookResponse } from "../dtos/response/webhook.response";
import { useCreateWebhook, useDeleteWebhook, useUpdateWebhook, useWebhooks } from "./use-webhooks";

export function useWebhooksPage() {
  const toast = useToast();
  const [applicationId, setApplicationId] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookResponse | null>(null);
  const [deletingWebhook, setDeletingWebhook] = useState<WebhookResponse | null>(null);

  const { data: applications } = useApplications();
  const { data: webhooks, isLoading, isError } = useWebhooks(applicationId);
  const createWebhook = useCreateWebhook();
  const updateWebhook = useUpdateWebhook();
  const deleteWebhook = useDeleteWebhook();

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
  });

  function handleOpenCreate() {
    resetCreate();
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    resetCreate();
  }

  function handleOpenEdit(webhook: WebhookResponse) {
    resetEdit({
      agent_id: webhook.agent_id,
      url: webhook.url,
      auth_type: webhook.auth_type || "",
      auth_token: "",
    });
    setEditingWebhook(webhook);
  }

  function handleCloseEdit() {
    setEditingWebhook(null);
    resetEdit();
  }

  const onCreateSubmit = handleCreateSubmit(async (data) => {
    try {
      await createWebhook.mutateAsync({ applicationId, data: { ...data, is_active: true } });
      toast.success("Webhook criado com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar webhook");
    }
  });

  const onEditSubmit = handleEditSubmit(async (data) => {
    if (!editingWebhook) return;
    try {
      await updateWebhook.mutateAsync({ id: editingWebhook.id, data });
      toast.success("Webhook atualizado com sucesso");
      handleCloseEdit();
    } catch {
      toast.error("Erro ao atualizar webhook");
    }
  });

  async function handleDelete() {
    if (!deletingWebhook) return;
    try {
      await deleteWebhook.mutateAsync(deletingWebhook.id);
      toast.success("Webhook excluído com sucesso");
      setDeletingWebhook(null);
    } catch {
      toast.error("Erro ao excluir webhook");
    }
  }

  function handleApplicationChange(value: string) {
    setApplicationId(Number(value) || 0);
  }

  return {
    applicationId,
    applications,
    handleApplicationChange,
    webhooks,
    isLoading,
    isError,
    isCreateOpen,
    editingWebhook,
    deletingWebhook,
    setDeletingWebhook,
    registerCreate,
    createErrors,
    registerEdit,
    editErrors,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
    onCreateSubmit,
    isCreating: createWebhook.isPending,
    onEditSubmit,
    isUpdating: updateWebhook.isPending,
    handleDelete,
    isDeleting: deleteWebhook.isPending,
  };
}
