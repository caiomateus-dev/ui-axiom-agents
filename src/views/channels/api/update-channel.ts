import { api } from "@/core";

import type { ChannelResponse } from "../dtos/response/channel.response";

export async function updateChannel(
  id: number,
  data: {
    name?: string;
    whitelist?: string[];
    config?: Record<string, unknown>;
  },
): Promise<ChannelResponse> {
  const response = await api.put<ChannelResponse>(`/channels/${id}`, data);
  return response.data;
}
