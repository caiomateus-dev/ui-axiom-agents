import { api } from "@/core";

import type { ChannelFormData } from "../dtos/request/channel.schema";
import type { ChannelResponse } from "../dtos/response/channel.response";

export async function createChannel(data: ChannelFormData): Promise<ChannelResponse> {
  const response = await api.post<ChannelResponse>("/channels", data);
  return response.data;
}
