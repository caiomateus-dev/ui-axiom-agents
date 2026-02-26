import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";

import { useOrganization } from "@/contexts";
import { useToast } from "@/contexts/ToastContext";

import type { AgentFormData } from "../dtos/request/agent.schema";
import { agentSchema } from "../dtos/request/agent.schema";
import { useAgents, useCreateAgent } from "./use-agents";

export function useAgentsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAllOrgs, organizations } = useOrganization();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const { data: agents, isLoading, isError } = useAgents();
  const createAgent = useCreateAgent();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
  });

  function handleOpenCreate() {
    setSelectedOrgId(null);
    reset();
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    setSelectedOrgId(null);
    reset();
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createAgent.mutateAsync({
        data,
        organizationId: isAllOrgs && selectedOrgId ? selectedOrgId : undefined,
      });
      toast.success("Agent criado com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar agent");
    }
  });

  function navigateToAgent(id: number) {
    navigate(`/agents/${id}`);
  }

  return {
    agents,
    isLoading,
    isError,
    isCreateOpen,
    register,
    errors,
    handleOpenCreate,
    handleCloseCreate,
    onSubmit,
    isCreating: createAgent.isPending,
    navigateToAgent,
    isAllOrgs,
    organizations,
    selectedOrgId,
    setSelectedOrgId,
  };
}
