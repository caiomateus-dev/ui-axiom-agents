import { z } from "zod";

export const agentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  model: z.string().min(1, "Modelo é obrigatório"),
});

export type AgentFormData = z.infer<typeof agentSchema>;
