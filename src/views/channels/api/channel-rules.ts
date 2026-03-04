import { api } from "@/core";

import type { RuleFormData } from "../dtos/request/channel.schema";
import type { RuleResponse } from "../dtos/response/channel.response";

export async function listRules(channelId: number): Promise<RuleResponse[]> {
  const response = await api.get<RuleResponse[]>(`/channels/${channelId}/rules`);
  return response.data;
}

export async function createRule(channelId: number, data: RuleFormData): Promise<RuleResponse> {
  const response = await api.post<RuleResponse>(`/channels/${channelId}/rules`, data);
  return response.data;
}

export async function updateRule(
  channelId: number,
  ruleId: number,
  data: Partial<RuleFormData>,
): Promise<RuleResponse> {
  const response = await api.put<RuleResponse>(`/channels/${channelId}/rules/${ruleId}`, data);
  return response.data;
}

export async function deleteRule(channelId: number, ruleId: number): Promise<void> {
  await api.delete(`/channels/${channelId}/rules/${ruleId}`);
}
