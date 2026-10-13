"use server";

import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { newsletterSchema, type NewsletterState } from "./schema";

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "");
  const parsed = newsletterSchema.safeParse({
    email,
    consent: formData.get("consent") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: NewsletterState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "email" | "consent";
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", fieldErrors, email };
  }

  const db = getAdminDb();
  if (!db) {
    // Firebase non configuré (développement) : on simule l'inscription.
    console.info("[newsletter] Firebase non configuré, inscription simulée :", parsed.data.email);
    return { status: "success", message: "Merci ! Votre inscription est enregistrée." };
  }

  try {
    const normalized = parsed.data.email.toLowerCase();
    // Identifiant dérivé de l'e-mail : une seule inscription par adresse.
    const id = createHash("sha256").update(normalized).digest("hex");
    await db.collection("newsletter_subscribers").doc(id).set(
      {
        email: normalized,
        consentAt: FieldValue.serverTimestamp(),
        source: "lta-le-mag",
      },
      { merge: true },
    );
    return { status: "success", message: "Merci ! Votre inscription est enregistrée." };
  } catch (error) {
    console.error("[newsletter]", error);
    return {
      status: "error",
      message: "L'inscription n'a pas pu être enregistrée. Réessayez dans un instant.",
      email,
    };
  }
}
