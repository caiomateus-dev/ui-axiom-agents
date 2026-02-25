import { api } from "@/core";

export async function syncTools(): Promise<void> {
  await api.post("/tools/sync");
}
