import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createMcpServer } from "../api/create-mcp-server";
import { deleteMcpServer } from "../api/delete-mcp-server";
import { listConnectionTypes } from "../api/list-connection-types";
import { listMcpServers } from "../api/list-mcp-servers";
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
