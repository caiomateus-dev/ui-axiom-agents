import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/contexts/ToastContext";

import type { PromptFormData, PromptUpdateFormData } from "../dtos/request/prompt.schema";
import { promptSchema, promptUpdateSchema } from "../dtos/request/prompt.schema";
import type { PromptResponse } from "../dtos/response/prompt.response";
import { useCreatePrompt, useDeletePrompt, usePrompts, useUpdatePrompt } from "./use-prompts";

export function usePromptsPage() {
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptResponse | null>(null);
  const [deletingPrompt, setDeletingPrompt] = useState<PromptResponse | null>(null);

  const { data: prompts, isLoading, isError } = usePrompts();
  const createPrompt = useCreatePrompt();
  const updatePrompt = useUpdatePrompt();
  const deletePrompt = useDeletePrompt();

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<PromptUpdateFormData>({
    resolver: zodResolver(promptUpdateSchema),
  });

  function handleOpenCreate() {
    resetCreate();
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    resetCreate();
  }

  function handleOpenEdit(prompt: PromptResponse) {
    resetEdit({ prompt: prompt.prompt, description: prompt.description });
    setEditingPrompt(prompt);
  }

  function handleCloseEdit() {
    setEditingPrompt(null);
    resetEdit();
  }

  const onCreateSubmit = handleSubmitCreate(async (data) => {
    try {
      await createPrompt.mutateAsync(data);
      toast.success("Prompt criado com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar prompt");
    }
  });

  const onEditSubmit = handleSubmitEdit(async (data) => {
    if (!editingPrompt) return;
    try {
      await updatePrompt.mutateAsync({ agentId: editingPrompt.agent_id, data });
      toast.success("Prompt atualizado com sucesso");
      handleCloseEdit();
    } catch {
      toast.error("Erro ao atualizar prompt");
    }
  });

  async function handleDelete() {
    if (!deletingPrompt) return;
    try {
      await deletePrompt.mutateAsync(deletingPrompt.agent_id);
      toast.success("Prompt excluído com sucesso");
      setDeletingPrompt(null);
    } catch {
      toast.error("Erro ao excluir prompt");
    }
  }

  return {
    prompts,
    isLoading,
    isError,
    isCreateOpen,
    editingPrompt,
    deletingPrompt,
    setDeletingPrompt,
    registerCreate,
    createErrors,
    registerEdit,
    editErrors,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
    onCreateSubmit,
    isCreating: createPrompt.isPending,
    onEditSubmit,
    isUpdating: updatePrompt.isPending,
    handleDelete,
    isDeleting: deletePrompt.isPending,
  };
}
