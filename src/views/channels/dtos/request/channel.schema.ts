import { z } from "zod";

export const channelSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  provider: z.enum(["whatsapp_waha", "whatsapp_cloud"], {
    error: "Provider é obrigatório",
  }),
  application_id: z.number({ error: "Aplicação é obrigatória" }),
  config: z.record(z.string(), z.unknown()).optional(),
  whitelist: z.array(z.string()).optional(),
});

export type ChannelFormData = z.infer<typeof channelSchema>;

export const ruleSchema = z.object({
  agent_id: z.number({ error: "Agente é obrigatório" }),
  order_index: z.number().int().min(0),
  rule_type: z.enum(["default", "schedule", "keyword"]),
  condition: z.record(z.string(), z.unknown()).optional(),
  is_active: z.boolean().optional(),
});

export type RuleFormData = z.infer<typeof ruleSchema>;
