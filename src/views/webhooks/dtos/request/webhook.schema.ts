import { z } from "zod";

export const webhookSchema = z.object({
  agent_id: z.number({ error: "Agent é obrigatório" }),
  url: z.string().url("URL inválida"),
  auth_type: z.string().optional(),
  auth_token: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;
