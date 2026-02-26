import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createAgent } from "../api/create-agent";
import { getAgent } from "../api/get-agent";
import { listAgents } from "../api/list-agents";
import type { AgentFormData } from "../dtos/request/agent.schema";

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: listAgents,
  });
}

export function useAgent(id: number) {
  return useQuery({
    queryKey: ["agents", id],
    queryFn: () => getAgent(id),
    enabled: !!id,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, organizationId }: { data: AgentFormData; organizationId?: number }) =>
      createAgent(data, organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
