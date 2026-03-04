import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  connectChannel,
  createChannel,
  createRule,
  deleteChannel,
  deleteRule,
  disconnectChannel,
  getChannelQR,
  listChannels,
  listConversations,
  listMessages,
  listRules,
  updateChannel,
  updateRule,
} from "../api";
import type { RuleFormData } from "../dtos/request/channel.schema";

export function useChannels() {
  return useQuery({
    queryKey: ["channels"],
    queryFn: listChannels,
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateChannel>[1] }) =>
      updateChannel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function useConnectChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function useDisconnectChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function useChannelQR(channelId: number, enabled: boolean) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["channel-qr", channelId],
    queryFn: () => getChannelQR(channelId),
    enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "active") {
        queryClient.invalidateQueries({ queryKey: ["channels"] });
        return false;
      }
      return 3000;
    },
  });
}

export function useChannelRules(channelId: number) {
  return useQuery({
    queryKey: ["channel-rules", channelId],
    queryFn: () => listRules(channelId),
    enabled: !!channelId,
  });
}

export function useCreateRule(channelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RuleFormData) => createRule(channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel-rules", channelId] });
    },
  });
}

export function useUpdateRule(channelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ruleId, data }: { ruleId: number; data: Partial<RuleFormData> }) =>
      updateRule(channelId, ruleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel-rules", channelId] });
    },
  });
}

export function useDeleteRule(channelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: number) => deleteRule(channelId, ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel-rules", channelId] });
    },
  });
}

export function useConversations(channelId: number) {
  return useQuery({
    queryKey: ["channel-conversations", channelId],
    queryFn: () => listConversations(channelId),
    enabled: !!channelId,
  });
}

export function useMessages(channelId: number, contactId: number) {
  return useQuery({
    queryKey: ["channel-messages", channelId, contactId],
    queryFn: () => listMessages(channelId, contactId),
    enabled: !!channelId && !!contactId,
  });
}
