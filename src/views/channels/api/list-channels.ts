import { api } from "@/core";

import type { ChannelResponse } from "../dtos/response/channel.response";

export async function listChannels(): Promise<ChannelResponse[]> {
  const response = await api.get<ChannelResponse[]>("/channels");
  return response.data;
}
