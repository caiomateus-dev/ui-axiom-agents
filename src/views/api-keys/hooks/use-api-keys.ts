import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createApiKey } from "../api/create-api-key";
import { deleteApiKey } from "../api/delete-api-key";
import { listApiKeys } from "../api/list-api-keys";
import { updateApiKey } from "../api/update-api-key";
import type { ApiKeyFormData } from "../dtos/request/api-key.schema";

export function useApiKeys(applicationId?: number) {
  return useQuery({
    queryKey: ["api-keys", applicationId],
    queryFn: () => listApiKeys(applicationId),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiKeyFormData> }) =>
      updateApiKey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}
