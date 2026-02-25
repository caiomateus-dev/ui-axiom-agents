import { z } from "zod";

export const toolSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type ToolFormData = z.infer<typeof toolSchema>;
