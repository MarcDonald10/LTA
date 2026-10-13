"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { verifyPassword } from "@/lib/auth/password";
import { ROLES, can, type Role, type SessionUser } from "@/lib/auth/roles";
import { createSession, destroySession } from "@/lib/auth/session";
import { slugify } from "@/lib/content/markup";
import type { ContentRecord, HistoryAction } from "@/lib/content/types";
import { readDb, updateDb } from "@/lib/server/db";
import {
  completeErrors,
  draftErrors,
  recordToValues,
  valuesFromFormData,
  valuesToFields,
  type ContentFormState,
  type FieldErrors,
} from "./content-values";

/* ------------------------------ Connexion ------------------------------ */

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Indiquez votre e-mail et votre mot de passe.", email };

  const user = (await readDb()).users.find((u) => u.email === email);
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) {
    await new Promise((r) => setTimeout(r, 400)); // ralentit les essais en série
    return { error: "E-mail ou mot de passe incorrect.", email };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/connexion");
}

/* ------------------------- Rédaction et validation ------------------------- */

const INTENTS = ["save", "submit", "request_changes", "approve", "publish", "unpublish"] as const;
type Intent = (typeof INTENTS)[number];

const SUCCESS: Record<Intent, string> = {
  save: "Modifications enregistrées.",
  submit: "Envoyé en relecture : un éditeur va le relire et vérifier les faits.",
  request_changes: "Renvoyé à l'auteur avec vos remarques.",
  approve: "Contenu validé : il peut maintenant être publié.",
  publish: "Publié : le contenu est en ligne.",
  unpublish: "Retiré du site : le contenu est repassé en brouillon.",
};

class Refusal extends Error {
  constructor(
    message: string,
    public fieldErrors?: FieldErrors,
  ) {
    super(message);
  }
}

function allowed(user: SessionUser, record: ContentRecord, intent: Intent) {
  switch (intent) {
    case "save":
      return can.edit(user, record);
    case "submit":
      return can.submit(user, record);
    case "request_changes":
      return can.requestChanges(user, record);
    case "approve":
      return can.approve(user, record);
    case "publish":
      return can.publish(user, record);
    case "unpublish":
      return can.unpublish(user, record);
  }
}

export async function saveContent(_prev: ContentFormState, fd: FormData): Promise<ContentFormState> {
  const values = valuesFromFormData(fd);
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Votre session a expiré. Reconnectez-vous dans un autre onglet, puis réessayez : votre saisie est conservée ici.", values };
  }

  const intent = String(fd.get("intent")) as Intent;
  if (!INTENTS.includes(intent)) return { status: "error", message: "Action inconnue.", values };
  const id = String(fd.get("id") ?? "");

  let outcome: { id: string; created: boolean; touchesSite: boolean; record: ContentRecord };
  try {
    outcome = await updateDb((db) => {
      const now = new Date().toISOString();
      const existing = id ? db.contents.find((c) => c.id === id) : undefined;
      if (id && !existing) throw new Refusal("Ce contenu n'existe plus.");

      // Droits : la création est ouverte à toute la rédaction, le reste dépend du statut.
      const draftFor = { createdBy: existing?.createdBy ?? user.id, status: existing?.status ?? "draft" } as ContentRecord;
      if (existing && !can.edit(user, existing)) {
        throw new Refusal("Vous ne pouvez plus modifier ce contenu à ce stade du circuit de validation.");
      }
      if (!allowed(user, existing ?? draftFor, intent)) {
        throw new Refusal("Cette action n'est pas autorisée pour votre rôle ou pour ce statut.");
      }

      // Un contenu publié garde son adresse (pas de lien cassé).
      if (existing?.status === "published") {
        values.slug = existing.slug;
        values.rubrique = existing.rubrique;
      }
      if (!can.chooseAuthor(user)) values.authorSlug = existing?.authorSlug ?? user.authorSlug;
      if (!can.markSponsored(user)) values.sponsoredBy = existing?.sponsoredBy ?? "";
      values.slug = values.slug || slugify(values.title);

      const lenient = intent === "save" || intent === "request_changes" || intent === "unpublish";
      const errors = lenient && existing?.status !== "published" ? draftErrors(values) : completeErrors(values);
      if (intent === "request_changes" && !values.reviewNote)
        errors.reviewNote = "Expliquez à l'auteur ce qu'il doit modifier.";
      if (intent === "approve" && values.factsChecked !== "on")
        errors.factsChecked = "Confirmez que les faits et les sources ont été vérifiés.";
      if (db.contents.some((c) => c.id !== id && c.rubrique === values.rubrique && c.slug === values.slug))
        errors.slug = "Cette adresse est déjà utilisée dans la rubrique : modifiez-la.";
      if (Object.keys(errors).length) {
        throw new Refusal(
          intent === "save" ? "Le contenu n'a pas été enregistré : corrigez les champs signalés." : "Action impossible : des champs obligatoires sont manquants ou incorrects.",
          errors,
        );
      }

      const historyEntry = (action: HistoryAction, note?: string) => ({
        at: now,
        userId: user.id,
        userName: user.name,
        action,
        note,
      });

      const fields = valuesToFields(values);
      const record: ContentRecord = existing
        ? ({ ...existing, ...fields, slug: values.slug, editedAt: now } as ContentRecord)
        : ({
            ...fields,
            id: `c${Date.now().toString(36)}`,
            slug: values.slug,
            publishedAt: "",
            status: "draft",
            createdBy: user.id,
            createdAt: now,
            editedAt: now,
            history: [historyEntry("created")],
          } as ContentRecord);
      const wasPublished = existing?.status === "published";

      switch (intent) {
        case "save":
          if (existing) record.history.push(historyEntry("saved"));
          if (wasPublished && values.correctionNote) {
            record.corrections = [...(record.corrections ?? []), { date: now, text: values.correctionNote }];
            record.updatedAt = now;
            record.history.push(historyEntry("corrected", values.correctionNote));
          }
          break;
        case "submit":
          record.status = "review";
          record.reviewNote = undefined;
          record.history.push(historyEntry("submitted"));
          break;
        case "request_changes":
          record.status = "draft";
          record.reviewNote = values.reviewNote;
          record.history.push(historyEntry("changes_requested", values.reviewNote));
          break;
        case "approve":
          record.status = "approved";
          record.history.push(historyEntry("approved", "Faits et sources vérifiés"));
          break;
        case "publish":
          record.status = "published";
          record.publishedAt ||= now;
          record.history.push(historyEntry("published"));
          break;
        case "unpublish":
          record.status = "draft";
          record.history.push(historyEntry("unpublished"));
          break;
      }

      if (existing) db.contents[db.contents.indexOf(existing)] = record;
      else db.contents.push(record);

      return {
        id: record.id,
        created: !existing,
        touchesSite: wasPublished || record.status === "published",
        record,
      };
    });
  } catch (error) {
    if (error instanceof Refusal) {
      return { status: "error", message: error.message, fieldErrors: error.fieldErrors, values };
    }
    console.error("[admin] enregistrement", error);
    return { status: "error", message: "L'enregistrement a échoué. Votre saisie est conservée : réessayez.", values };
  }

  // Le site public se met à jour dès qu'un contenu en ligne change.
  if (outcome.touchesSite) updateTag("contents");
  if (outcome.created) redirect(`/admin/contenus/${outcome.id}?cree=1`);
  // Met à jour le statut, les boutons autorisés et l'historique affichés.
  refresh();

  return { status: "success", message: SUCCESS[intent], values: recordToValues(outcome.record) };
}

export async function deleteContent(fd: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/connexion");
  const id = String(fd.get("id") ?? "");

  const deleted = await updateDb((db) => {
    const record = db.contents.find((c) => c.id === id);
    if (!record || !can.remove(user, record)) return false;
    db.contents.splice(db.contents.indexOf(record), 1);
    return true;
  });
  redirect(deleted ? "/admin?supprime=1" : `/admin/contenus/${id}`);
}

/* ------------------------------ Utilisateurs ------------------------------ */

export type RoleState = { status: "idle" | "success" | "error"; message?: string };

export async function updateUserRole(_prev: RoleState, fd: FormData): Promise<RoleState> {
  const user = await getCurrentUser();
  if (!user || !can.manageUsers(user)) return { status: "error", message: "Action réservée aux administrateurs." };

  const userId = String(fd.get("userId") ?? "");
  const role = String(fd.get("role") ?? "") as Role;
  if (!(role in ROLES)) return { status: "error", message: "Rôle inconnu." };
  if (userId === user.id) return { status: "error", message: "Vous ne pouvez pas modifier votre propre rôle." };

  const ok = await updateDb((db) => {
    const target = db.users.find((u) => u.id === userId);
    if (!target) return false;
    target.role = role;
    return true;
  });
  if (ok) refresh();
  return ok
    ? { status: "success", message: `Rôle mis à jour : ${ROLES[role].label}.` }
    : { status: "error", message: "Utilisateur introuvable." };
}
