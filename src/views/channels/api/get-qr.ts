import { api } from "@/core";

import type { QRResponse } from "../dtos/response/channel.response";

export async function getChannelQR(id: number): Promise<QRResponse> {
  const response = await api.get<QRResponse>(`/channels/${id}/qr`);
  return response.data;
}
