import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/contexts/ToastContext";

import type { ToolFormData } from "../dtos/request/tool.schema";
import { toolSchema } from "../dtos/request/tool.schema";
import type { ToolResponse } from "../dtos/response/tool.response";
import { useSyncTools, useTools, useUpdateTool } from "./use-tools";

export function useToolsPage() {
  const toast = useToast();
  const [editingTool, setEditingTool] = useState<ToolResponse | null>(null);

  const { data: tools, isLoading, isError } = useTools();
  const syncTools = useSyncTools();
  const updateTool = useUpdateTool();

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
  });

  function handleSync() {
    syncTools.mutate(undefined, {
      onSuccess: () => toast.success("Tools sincronizadas com sucesso"),
      onError: () => toast.error("Erro ao sincronizar tools"),
    });
  }

  function handleOpenEdit(tool: ToolResponse) {
    resetEdit({
      name: tool.name,
      description: tool.description || "",
      is_active: tool.is_active,
    });
    setEditingTool(tool);
  }

  function handleCloseEdit() {
    setEditingTool(null);
    resetEdit();
  }

  const onEditSubmit = handleEditSubmit(async (data) => {
    if (!editingTool) return;
    try {
      await updateTool.mutateAsync({ id: editingTool.id, data });
      toast.success("Tool atualizada com sucesso");
      handleCloseEdit();
    } catch {
      toast.error("Erro ao atualizar tool");
    }
  });

  return {
    tools,
    isLoading,
    isError,
    editingTool,
    registerEdit,
    editErrors,
    handleSync,
    isSyncing: syncTools.isPending,
    handleOpenEdit,
    handleCloseEdit,
    onEditSubmit,
    isUpdating: updateTool.isPending,
  };
}
