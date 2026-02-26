import { z } from "zod";

export const agentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export type AgentFormData = z.infer<typeof agentSchema>;
