import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().min(1, { error: "E-mail é obrigatório" }).email({ error: "E-mail inválido" }),
  password: z.string().min(6, { error: "Senha deve ter no mínimo 6 caracteres" }),
  name: z.string().min(1, { error: "Nome é obrigatório" }),
  is_staff: z.boolean(),
  is_superuser: z.boolean(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.string().email({ error: "E-mail inválido" }).optional(),
  name: z.string().min(1, { error: "Nome é obrigatório" }).optional(),
  is_staff: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
