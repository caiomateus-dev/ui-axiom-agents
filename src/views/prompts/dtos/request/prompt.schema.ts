import { z } from "zod";

export const promptSchema = z.object({
  agent_id: z.number({ error: "Agent é obrigatório" }),
  prompt: z.string().min(1, "Prompt é obrigatório"),
  description: z.string().optional(),
});

export type PromptFormData = z.infer<typeof promptSchema>;

export const promptUpdateSchema = z.object({
  prompt: z.string().min(1, "Prompt é obrigatório"),
  description: z.string().optional(),
});

export type PromptUpdateFormData = z.infer<typeof promptUpdateSchema>;
