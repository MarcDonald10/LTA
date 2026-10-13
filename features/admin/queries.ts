import "server-only";
import { can, hasRole, type SessionUser } from "@/lib/auth/roles";
import { AUTHORS } from "@/lib/content/sample-data";
import type { ContentRecord, ContentStatus } from "@/lib/content/types";
import { readDb } from "@/lib/server/db";

export type ContentRow = Pick<
  ContentRecord,
  "id" | "title" | "rubrique" | "format" | "status" | "editedAt" | "reviewNote" | "slug"
> & { authorName: string; mine: boolean };

/** Contenus visibles : tout pour l'édition, ses propres contenus pour un rédacteur. */
export async function listContents(
  user: SessionUser,
  filters: { status?: ContentStatus; q?: string },
) {
  const { contents } = await readDb();
  const visible = contents.filter((c) => can.view(user, c));

  const counts = { all: visible.length, draft: 0, review: 0, approved: 0, published: 0 };
  for (const c of visible) counts[c.status]++;

  const q = filters.q?.toLocaleLowerCase("fr");
  const rows: ContentRow[] = visible
    .filter((c) => !filters.status || c.status === filters.status)
    .filter((c) => !q || c.title.toLocaleLowerCase("fr").includes(q))
    .sort((a, b) => b.editedAt.localeCompare(a.editedAt))
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      rubrique: c.rubrique,
      format: c.format,
      status: c.status,
      editedAt: c.editedAt,
      reviewNote: c.reviewNote,
      authorName: AUTHORS.find((a) => a.slug === c.authorSlug)?.name ?? "—",
      mine: c.createdBy === user.id,
    }));

  // Ce qui attend une action de l'utilisateur connecté
  const todo = hasRole(user, "editeur")
    ? { review: counts.review, approved: counts.approved }
    : { returned: visible.filter((c) => c.status === "draft" && c.reviewNote).length };

  return { rows, counts, todo };
}

export async function getContentForUser(user: SessionUser, id: string) {
  const { contents } = await readDb();
  const record = contents.find((c) => c.id === id);
  if (!record) return { state: "not-found" as const };
  if (!can.view(user, record)) return { state: "forbidden" as const };
  return { state: "ok" as const, record };
}

/** Contenus publiés proposés comme « contenu approfondi » d'un format court. */
export async function listDeepDiveOptions() {
  const { contents } = await readDb();
  return contents
    .filter((c) => c.status === "published" && c.format !== "court")
    .map((c) => ({ value: c.slug, label: c.title }));
}

export async function listUsers() {
  const { users } = await readDb();
  return users.map(({ passwordHash: _hash, ...u }) => u); // eslint-disable-line @typescript-eslint/no-unused-vars
}
