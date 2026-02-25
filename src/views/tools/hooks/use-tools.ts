import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    mutationFn: ({ id, data }: { id: number; data: { name?: string; description?: string; is_active?: boolean } }) =>
      updateTool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}
