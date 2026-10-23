import { z } from "zod";
import { relationshipOptions } from "@/lib/event";

export const rsvpSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(120, "O nome deve ter no máximo 120 caracteres.")
    .refine((name) => name.split(/\s+/).length >= 2, "Informe nome e sobrenome."),
  relationship: z
    .union([z.enum(relationshipOptions), z.literal(""), z.null()])
    .optional()
    .transform((value) => value || null),
  submission_key: z.string().uuid("Não foi possível validar o envio. Tente novamente."),
  website: z.string().max(0, "Envio inválido.").optional(),
});

export type RsvpFormValues = z.input<typeof rsvpSchema>;
export type RsvpSubmission = z.output<typeof rsvpSchema>;
