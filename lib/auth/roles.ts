import type { ContentRecord } from "@/lib/content/types";

/*
 * Rôles de la rédaction (cahier des charges §3), hiérarchiques :
 * rédacteur < éditeur < administrateur. Hypothèse : l'administrateur a aussi
 * les droits d'un éditeur (petite équipe). Le rôle contributeur arrive en phase 3.
 */
export const ROLES = {
  redacteur: { label: "Rédacteur", rank: 1 },
  editeur: { label: "Éditeur", rank: 2 },
  admin: { label: "Administrateur", rank: 3 },
} as const;

export type Role = keyof typeof ROLES;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  authorSlug: string;
};

export function hasRole(user: SessionUser, min: Role) {
  return ROLES[user.role].rank >= ROLES[min].rank;
}

const isOwner = (user: SessionUser, c: Pick<ContentRecord, "createdBy">) => c.createdBy === user.id;

type C = Pick<ContentRecord, "createdBy" | "status">;

/** Règles d'accès, vérifiées côté serveur dans chaque page et chaque action. */
export const can = {
  view: (u: SessionUser, c: C) => hasRole(u, "editeur") || isOwner(u, c),
  edit: (u: SessionUser, c: C) =>
    hasRole(u, "editeur") || (isOwner(u, c) && c.status === "draft"),
  submit: (u: SessionUser, c: C) => c.status === "draft" && (hasRole(u, "editeur") || isOwner(u, c)),
  requestChanges: (u: SessionUser, c: C) =>
    hasRole(u, "editeur") && (c.status === "review" || c.status === "approved"),
  approve: (u: SessionUser, c: C) => hasRole(u, "editeur") && c.status === "review",
  publish: (u: SessionUser, c: C) => hasRole(u, "editeur") && c.status === "approved",
  unpublish: (u: SessionUser, c: C) => hasRole(u, "editeur") && c.status === "published",
  remove: (u: SessionUser, c: C) =>
    c.status !== "published" && (hasRole(u, "editeur") || (isOwner(u, c) && c.status === "draft")),
  chooseAuthor: (u: SessionUser) => hasRole(u, "editeur"),
  markSponsored: (u: SessionUser) => hasRole(u, "editeur"),
  manageUsers: (u: SessionUser) => u.role === "admin",
};

export const STATUS_LABELS: Record<ContentRecord["status"], string> = {
  draft: "Brouillon",
  review: "En relecture",
  approved: "Validé",
  published: "Publié",
};
