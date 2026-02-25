import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import { createWebhook } from "../api/create-webhook";
import { deleteWebhook } from "../api/delete-webhook";
import { listWebhooks } from "../api/list-webhooks";
import { updateWebhook } from "../api/update-webhook";
import type { WebhookFormData } from "../dtos/request/webhook.schema";

export function useWebhooks(applicationId: number) {
  return useQuery({
    queryKey: ["webhooks", applicationId],
    queryFn: () => listWebhooks(applicationId),
    enabled: applicationId > 0,
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: number;
      data: WebhookFormData;
    }) => createWebhook(applicationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WebhookFormData> }) =>
      updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });
}
