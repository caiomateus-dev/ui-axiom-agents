import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import { createPrompt } from "../api/create-prompt";
import { deletePrompt } from "../api/delete-prompt";
import { listPrompts } from "../api/list-prompts";
import { updatePrompt } from "../api/update-prompt";
import type { PromptUpdateFormData } from "../dtos/request/prompt.schema";

export function usePrompts() {
  return useQuery({
    queryKey: ["prompts"],
    queryFn: listPrompts,
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, data }: { agentId: number; data: PromptUpdateFormData }) =>
      updatePrompt(agentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}
