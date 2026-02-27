import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { assignTool, removeTool } from "../api/assign-tool";
import { getAgentTools } from "../api/get-agent-tools";
import { listTools } from "../api/list-tools";
import { syncTools } from "../api/sync-tools";
import { updateTool } from "../api/update-tool";

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: listTools,
  });
}

export function useSyncTools() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncTools,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}

export function useUpdateTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; description?: string; is_active?: boolean };
    }) => updateTool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}

export function useAgentTools(agentId: number) {
  return useQuery({
    queryKey: ["agent-tools", agentId],
    queryFn: () => getAgentTools(agentId),
    enabled: !!agentId,
  });
}

export function useAssignTool(agentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (toolId: number) => assignTool(agentId, toolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-tools", agentId] });
    },
  });
}

export function useRemoveTool(agentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (toolId: number) => removeTool(agentId, toolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-tools", agentId] });
    },
  });
}
