import { cacheLife, cacheTag } from "next/cache";
import type { Format, RubriqueSlug } from "@/lib/rubriques";
import { readDb } from "@/lib/server/db";
import { AUTHORS } from "./sample-data";
import type { Author, Content, ContentRecord, ContentSummary } from "./types";

/*
 * Accès aux contenus publiés. Toutes les lectures passent par `use cache`
 * avec l'étiquette "contents" : à la publication, l'administration appellera
 * revalidateTag("contents") pour mettre le site à jour.
 *
 * Source actuelle : base de test locale (lib/server/db.ts). Pour brancher
 * Firestore, remplacer uniquement loadPublished() et loadAuthors().
 */

async function loadPublished(): Promise<Content[]> {
  const { contents } = await readDb();
  return contents
    .filter((c) => c.status === "published")
    .map(toPublic)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Retire les champs de suivi éditorial avant d'exposer un contenu au public. */
function toPublic(record: ContentRecord): Content {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status, createdBy, createdAt, editedAt, reviewNote, history, ...content } = record;
  return content;
}

async function loadAuthors(): Promise<Author[]> {
  return AUTHORS;
}

function summarize(content: Content, authors: Author[]): ContentSummary {
  const author = authors.find((a) => a.slug === content.authorSlug);
  return {
    id: content.id,
    slug: content.slug,
    rubrique: content.rubrique,
    format: content.format,
    title: content.title,
    chapo: content.chapo,
    authorSlug: content.authorSlug,
    authorName: author?.name ?? "La rédaction",
    publishedAt: content.publishedAt,
    cover: content.cover,
    sponsoredBy: content.sponsoredBy,
  };
}

export async function getHomeContent() {
  "use cache";
  cacheLife("minutes");
  cacheTag("contents");

  const [all, authors] = await Promise.all([loadPublished(), loadAuthors()]);
  const featured = all.find((c) => c.featured) ?? all[0];
  const interview = all.find((c) => c.format === "entretien");
  const latest = all
    .filter((c) => c.id !== featured?.id && c.id !== interview?.id)
    .slice(0, 6);

  return {
    featured: featured ? summarize(featured, authors) : undefined,
    interview: interview ? summarize(interview, authors) : undefined,
    latest: latest.map((c) => summarize(c, authors)),
  };
}

export const PAGE_SIZE = 9;

export async function getRubriqueContents(
  rubrique: RubriqueSlug,
  format: Format | undefined,
  page: number,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("contents");

  const [all, authors] = await Promise.all([loadPublished(), loadAuthors()]);
  const filtered = all.filter(
    (c) => c.rubrique === rubrique && (!format || c.format === format),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);

  return {
    items: filtered
      .slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
      .map((c) => summarize(c, authors)),
    total: filtered.length,
    page: current,
    pageCount,
  };
}

export async function getContent(rubrique: string, slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("contents");

  const [all, authors] = await Promise.all([loadPublished(), loadAuthors()]);
  const content = all.find((c) => c.rubrique === rubrique && c.slug === slug);
  if (!content) return undefined;

  const related = all
    .filter((c) => c.rubrique === content.rubrique && c.id !== content.id)
    .slice(0, 3)
    .map((c) => summarize(c, authors));
  const deepDive =
    content.format === "court" && content.deepDiveSlug
      ? all.find((c) => c.slug === content.deepDiveSlug)
      : undefined;

  return {
    content,
    author: authors.find((a) => a.slug === content.authorSlug),
    related,
    deepDive: deepDive ? summarize(deepDive, authors) : undefined,
  };
}

export async function getAllContentPaths() {
  "use cache";
  cacheLife("minutes");
  cacheTag("contents");

  const all = await loadPublished();
  return all.map((c) => ({
    rubrique: c.rubrique,
    slug: c.slug,
    updatedAt: c.updatedAt ?? c.publishedAt,
  }));
}
