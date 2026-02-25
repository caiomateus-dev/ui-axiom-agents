import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
