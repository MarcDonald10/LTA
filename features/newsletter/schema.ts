import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Indiquez votre adresse e-mail.")
    .email("Cette adresse e-mail n'est pas valide (exemple : nom@domaine.cm)."),
  consent: z.literal("on", {
    error: "Cochez la case pour accepter de recevoir la newsletter.",
  }),
});

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "consent", string>>;
  email?: string;
};
