import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createMcpServer } from "../api/create-mcp-server";
import { deleteMcpServer } from "../api/delete-mcp-server";
import { linkMcpToAgent } from "../api/link-mcp-to-agent";
import { listAgentMcpLinks } from "../api/list-agent-mcp-links";
import { listConnectionTypes } from "../api/list-connection-types";
import { listMcpServers } from "../api/list-mcp-servers";
import { unlinkMcpFromAgent } from "../api/unlink-mcp-from-agent";
import { updateMcpServer } from "../api/update-mcp-server";
import type { McpServerFormData } from "../dtos/request/mcp-server.schema";

export function useMcpServers() {
  return useQuery({
    queryKey: ["mcp-servers"],
    queryFn: listMcpServers,
  });
}

export function useConnectionTypes() {
  return useQuery({
    queryKey: ["connection-types"],
    queryFn: listConnectionTypes,
  });
}

export function useCreateMcpServer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMcpServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcp-servers"] });
    },
  });
}

export function useUpdateMcpServer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<McpServerFormData> }) =>
      updateMcpServer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcp-servers"] });
    },
  });
}

export function useDeleteMcpServer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMcpServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mcp-servers"] });
    },
  });
}

export function useAgentMcpLinks(agentId: number) {
  return useQuery({
    queryKey: ["agent-mcp-links", agentId],
    queryFn: () => listAgentMcpLinks(agentId),
    enabled: agentId > 0,
  });
}

export function useLinkMcpToAgent(agentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mcpServerId: number) => linkMcpToAgent(agentId, mcpServerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-mcp-links", agentId] });
    },
  });
}

export function useUnlinkMcpFromAgent(agentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: number) => unlinkMcpFromAgent(agentId, linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-mcp-links", agentId] });
    },
  });
}
