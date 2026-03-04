import { api } from "@/core";

import type { ContactResponse } from "../dtos/response/channel.response";

export async function listConversations(channelId: number): Promise<ContactResponse[]> {
  const response = await api.get<ContactResponse[]>(`/channels/${channelId}/conversations`);
  return response.data;
}
