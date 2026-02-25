import { useState } from "react";

import { useToast } from "@/contexts/ToastContext";

import type { McpServerFormData } from "../dtos/request/mcp-server.schema";
import type { McpServerResponse } from "../dtos/response/mcp-server.response";
import {
  useConnectionTypes,
  useCreateMcpServer,
  useDeleteMcpServer,
  useMcpServers,
  useUpdateMcpServer,
} from "./use-mcp-servers";

export function useMcpServersPage() {
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<McpServerResponse | null>(null);
  const [deletingServer, setDeletingServer] = useState<McpServerResponse | null>(null);

  const [formName, setFormName] = useState("");
  const [formConnectionTypeId, setFormConnectionTypeId] = useState<number>(0);
  const [formConfig, setFormConfig] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editConnectionTypeId, setEditConnectionTypeId] = useState<number>(0);
  const [editConfig, setEditConfig] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const { data: servers, isLoading, isError } = useMcpServers();
  const { data: connectionTypes } = useConnectionTypes();
  const createServer = useCreateMcpServer();
  const updateServer = useUpdateMcpServer();
  const deleteServer = useDeleteMcpServer();

  function handleOpenCreate() {
    setFormName("");
    setFormConnectionTypeId(0);
    setFormConfig("");
    setFormError(null);
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    setFormError(null);
  }

  function handleOpenEdit(server: McpServerResponse) {
    setEditName(server.name);
    setEditConnectionTypeId(server.connection_type_id);
    setEditConfig(server.config ? JSON.stringify(server.config, null, 2) : "");
    setEditError(null);
    setEditingServer(server);
  }

  function handleCloseEdit() {
    setEditingServer(null);
    setEditError(null);
  }

  async function onCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Nome é obrigatório");
      return;
    }
    if (!formConnectionTypeId) {
      setFormError("Tipo de conexão é obrigatório");
      return;
    }

    let parsedConfig: Record<string, unknown> | undefined;
    if (formConfig.trim()) {
      try {
        parsedConfig = JSON.parse(formConfig);
      } catch {
        setFormError("Config deve ser um JSON válido");
        return;
      }
    }

    const data: McpServerFormData = {
      connection_type_id: formConnectionTypeId,
      name: formName,
      config: parsedConfig,
    };

    try {
      await createServer.mutateAsync(data);
      toast.success("MCP Server criado com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar MCP Server");
    }
  }

  async function onEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingServer) return;
    setEditError(null);

    if (!editName.trim()) {
      setEditError("Nome é obrigatório");
      return;
    }
    if (!editConnectionTypeId) {
      setEditError("Tipo de conexão é obrigatório");
      return;
    }

    let parsedConfig: Record<string, unknown> | undefined;
    if (editConfig.trim()) {
      try {
        parsedConfig = JSON.parse(editConfig);
      } catch {
        setEditError("Config deve ser um JSON válido");
        return;
      }
    }

    const data: McpServerFormData = {
      connection_type_id: editConnectionTypeId,
      name: editName,
      config: parsedConfig,
    };

    try {
      await updateServer.mutateAsync({ id: editingServer.id, data });
      toast.success("MCP Server atualizado com sucesso");
      handleCloseEdit();
    } catch {
      toast.error("Erro ao atualizar MCP Server");
    }
  }

  async function handleDelete() {
    if (!deletingServer) return;
    try {
      await deleteServer.mutateAsync(deletingServer.id);
      toast.success("MCP Server excluído com sucesso");
      setDeletingServer(null);
    } catch {
      toast.error("Erro ao excluir MCP Server");
    }
  }

  return {
    servers,
    isLoading,
    isError,
    connectionTypes,
    isCreateOpen,
    editingServer,
    deletingServer,
    setDeletingServer,
    formName,
    setFormName,
    formConnectionTypeId,
    setFormConnectionTypeId,
    formConfig,
    setFormConfig,
    formError,
    editName,
    setEditName,
    editConnectionTypeId,
    setEditConnectionTypeId,
    editConfig,
    setEditConfig,
    editError,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
    onCreateSubmit,
    isCreating: createServer.isPending,
    onEditSubmit,
    isUpdating: updateServer.isPending,
    handleDelete,
    isDeleting: deleteServer.isPending,
  };
}
