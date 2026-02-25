import { z } from "zod";

export const mcpServerSchema = z.object({
  connection_type_id: z.number({ error: "Tipo de conexão é obrigatório" }),
  name: z.string().min(1, "Nome é obrigatório"),
  config: z.record(z.string(), z.unknown()).optional(),
  is_active: z.boolean().optional(),
});

export type McpServerFormData = z.infer<typeof mcpServerSchema>;
