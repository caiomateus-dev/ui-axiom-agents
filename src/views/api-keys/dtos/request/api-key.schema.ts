import { z } from "zod";

export const apiKeySchema = z.object({
  application_id: z.number({ error: "Application é obrigatória" }),
  name: z.string().min(1, "Nome é obrigatório"),
  is_active: z.boolean().optional(),
});

export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
