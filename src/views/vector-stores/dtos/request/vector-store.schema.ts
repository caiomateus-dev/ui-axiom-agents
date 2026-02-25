import { z } from "zod";

export const vectorStoreSchema = z.object({
  agent_id: z.number({ error: "Agent é obrigatório" }),
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  text: z.string().optional(),
});

export type VectorStoreFormData = z.infer<typeof vectorStoreSchema>;
