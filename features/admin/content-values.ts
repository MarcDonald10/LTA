import {
  parseBody,
  parseList,
  parseSources,
  serializeBody,
  serializeSources,
  slugify,
} from "@/lib/content/markup";
import type { ContentRecord } from "@/lib/content/types";
import { AUTHORS } from "@/lib/content/sample-data";
import { FORMATS, RUBRIQUES, type Format } from "@/lib/rubriques";

/** Valeurs brutes du formulaire de rédaction (toujours des chaînes). */
export const FIELD_NAMES = [
  "title",
  "slug",
  "chapo",
  "rubrique",
  "format",
  "authorSlug",
  "coverAlt",
  "coverCredit",
  "coverRights",
  "body",
  "sources",
  "tags",
  "sponsoredBy",
  "guest",
  "videoId",
  "excerpts",
  "quoteText",
  "quoteAuthor",
  "deepDiveSlug",
  "correctionNote",
  "reviewNote",
  "factsChecked",
] as const;

export type FieldName = (typeof FIELD_NAMES)[number];
export type FormValues = Record<FieldName, string>;
export type FieldErrors = Partial<Record<FieldName, string>>;

export type ContentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  values?: FormValues;
};

export function emptyValues(format: Format, authorSlug: string): FormValues {
  const v = Object.fromEntries(FIELD_NAMES.map((n) => [n, ""])) as FormValues;
  v.format = format;
  v.rubrique = RUBRIQUES[0].slug;
  v.authorSlug = authorSlug;
  return v;
}

export function recordToValues(r: ContentRecord): FormValues {
  const v = emptyValues(r.format, r.authorSlug);
  Object.assign(v, {
    title: r.title,
    slug: r.slug,
    chapo: r.chapo,
    rubrique: r.rubrique,
    coverAlt: r.cover.alt,
    coverCredit: r.cover.credit,
    coverRights: r.cover.rights ?? "",
    body: serializeBody(r.body),
    sources: serializeSources(r.sources),
    tags: r.tags.join(", "),
    sponsoredBy: r.sponsoredBy ?? "",
  });
  if (r.format === "entretien") {
    v.guest = r.guest;
    v.videoId = r.media?.id ?? "";
    v.excerpts = r.excerpts.join("\n");
  }
  if (r.format === "court") {
    v.quoteText = r.quote?.text ?? "";
    v.quoteAuthor = r.quote?.author ?? "";
    v.videoId = r.media?.id ?? "";
    v.deepDiveSlug = r.deepDiveSlug ?? "";
  }
  return v;
}

export function valuesFromFormData(fd: FormData): FormValues {
  return Object.fromEntries(
    FIELD_NAMES.map((n) => [n, String(fd.get(n) ?? "").trim()]),
  ) as FormValues;
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Contrôles minimaux pour enregistrer un brouillon. */
export function draftErrors(v: FormValues): FieldErrors {
  const e: FieldErrors = {};
  if (v.title.length < 3) e.title = "Le titre doit compter au moins 3 caractères.";
  else if (v.title.length > 140) e.title = "Le titre ne doit pas dépasser 140 caractères.";
  if (v.slug && v.slug !== slugify(v.slug))
    e.slug = "Lettres minuscules sans accents, chiffres et tirets uniquement.";
  if (!RUBRIQUES.some((r) => r.slug === v.rubrique)) e.rubrique = "Choisissez une rubrique.";
  if (!(v.format in FORMATS)) e.format = "Format inconnu.";
  if (v.videoId && !YOUTUBE_ID.test(v.videoId))
    e.videoId = "L'identifiant YouTube compte 11 caractères (ex. dQw4w9WgXcQ).";
  const badSource = parseSources(v.sources).find((s) => s.url && !/^(https?:\/\/|\/)/.test(s.url));
  if (badSource) e.sources = `Adresse invalide pour « ${badSource.label} » : elle doit commencer par https://`;
  return e;
}

/** Champs obligatoires (cahier des charges §5) avant relecture et publication. */
export function completeErrors(v: FormValues): FieldErrors {
  const e = draftErrors(v);
  if (v.chapo.length < 40) e.chapo = "Le chapô est obligatoire (40 caractères minimum).";
  else if (v.chapo.length > 400) e.chapo = "Le chapô ne doit pas dépasser 400 caractères.";
  if (!AUTHORS.some((a) => a.slug === v.authorSlug)) e.authorSlug = "Choisissez un auteur.";
  if (!v.coverAlt) e.coverAlt = "Décrivez l'image de une (texte alternatif).";
  if (!v.coverCredit) e.coverCredit = "Le crédit de l'image de une est obligatoire.";
  if (!parseBody(v.body).length) e.body = "Le corps du contenu est vide.";
  if (!parseSources(v.sources).length) e.sources ??= "Indiquez au moins une source.";
  if (v.format === "entretien" && !v.guest) e.guest = "Indiquez la personne interviewée.";
  if (v.format === "court" && !v.quoteText && !v.videoId)
    e.quoteText = "Un format court contient une citation ou une vidéo.";
  return e;
}

/** Construit les champs du contenu à partir du formulaire. */
export function valuesToFields(v: FormValues) {
  const base = {
    title: v.title,
    chapo: v.chapo,
    rubrique: v.rubrique as ContentRecord["rubrique"],
    authorSlug: v.authorSlug,
    cover: { alt: v.coverAlt, credit: v.coverCredit, rights: v.coverRights || undefined },
    body: parseBody(v.body),
    sources: parseSources(v.sources),
    tags: parseList(v.tags, /,/),
    sponsoredBy: v.sponsoredBy || undefined,
  };
  const media = (vertical: boolean) =>
    v.videoId ? { provider: "youtube" as const, id: v.videoId, title: v.title, vertical } : undefined;

  switch (v.format as Format) {
    case "entretien":
      return { ...base, format: "entretien" as const, guest: v.guest, media: media(false), excerpts: parseList(v.excerpts) };
    case "court":
      return {
        ...base,
        format: "court" as const,
        quote: v.quoteText ? { text: v.quoteText, author: v.quoteAuthor } : undefined,
        media: media(true),
        deepDiveSlug: v.deepDiveSlug || undefined,
      };
    default:
      return { ...base, format: "article" as const };
  }
}
