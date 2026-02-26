import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, { error: "Nome e obrigatorio" }),
  slug: z.string().min(1, { error: "Slug e obrigatorio" }),
  is_active: z.boolean().optional(),
});

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = z.object({
  name: z.string().min(1, { error: "Nome e obrigatorio" }).optional(),
  slug: z.string().min(1, { error: "Slug e obrigatorio" }).optional(),
  is_active: z.boolean().optional(),
});

export type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().min(1, { error: "E-mail e obrigatorio" }).email({ error: "E-mail invalido" }),
  name: z.string().min(1, { error: "Nome e obrigatorio" }),
  password: z.string().min(6, { error: "Senha deve ter no minimo 6 caracteres" }),
  role: z.enum(["admin", "member"], { error: "Role invalido" }),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
