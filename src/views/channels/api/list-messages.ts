import { api } from "@/core";

import type { MessageResponse } from "../dtos/response/channel.response";

export async function listMessages(
  channelId: number,
  contactId: number,
): Promise<MessageResponse[]> {
  const response = await api.get<MessageResponse[]>(
    `/channels/${channelId}/conversations/${contactId}/messages`,
  );
  return response.data;
}
