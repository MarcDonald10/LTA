import type { Format, RubriqueSlug } from "@/lib/rubriques";

export type MediaImage = {
  /** Absent tant que la photo (droits vérifiés) n'est pas téléversée. */
  src?: string;
  alt: string;
  credit: string;
  /** Mention des droits d'utilisation (bibliothèque de médias). */
  rights?: string;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "keypoints"; title: string; items: string[] }
  | { type: "image"; image: MediaImage; caption?: string };

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo?: MediaImage;
};

export type Source = { label: string; url?: string };

export type Correction = { date: string; text: string };

export type VideoEmbed = {
  provider: "youtube";
  /** Identifiant YouTube ; vide si la vidéo n'est pas encore en ligne. */
  id: string;
  title: string;
  vertical?: boolean;
};

type ContentBase = {
  id: string;
  slug: string;
  rubrique: RubriqueSlug;
  title: string;
  chapo: string;
  authorSlug: string;
  publishedAt: string;
  updatedAt?: string;
  cover: MediaImage;
  body: Block[];
  sources: Source[];
  tags: string[];
  featured?: boolean;
  /** Contenu sponsorisé : nom du partenaire. */
  sponsoredBy?: string;
  corrections?: Correction[];
};

export type ArticleContent = ContentBase & { format: "article" };

export type InterviewContent = ContentBase & {
  format: "entretien";
  guest: string;
  media?: VideoEmbed;
  excerpts: string[];
};

export type ShortContent = ContentBase & {
  format: "court";
  quote?: { text: string; author: string };
  media?: VideoEmbed;
  /** Slug du contenu approfondi vers lequel renvoie le format court. */
  deepDiveSlug?: string;
};

export type Content = ArticleContent | InterviewContent | ShortContent;

export type ContentSummary = Pick<
  Content,
  | "id"
  | "slug"
  | "rubrique"
  | "format"
  | "title"
  | "chapo"
  | "authorSlug"
  | "publishedAt"
  | "cover"
  | "sponsoredBy"
> & { authorName: string };

/* ---------- Rédaction : statuts, historique, enregistrement complet ---------- */

/** Brouillon → En relecture → Validé → Publié (cahier des charges §5). */
export type ContentStatus = "draft" | "review" | "approved" | "published";

export type HistoryAction =
  | "created"
  | "saved"
  | "submitted"
  | "changes_requested"
  | "approved"
  | "published"
  | "unpublished"
  | "corrected";

export type HistoryEntry = {
  at: string;
  userId: string;
  userName: string;
  action: HistoryAction;
  note?: string;
};

/** Contenu tel qu'il est stocké : champs publics + suivi éditorial. */
export type ContentRecord = Content & {
  status: ContentStatus;
  createdBy: string;
  createdAt: string;
  editedAt: string;
  /** Dernière demande de modification de l'éditeur, visible par l'auteur. */
  reviewNote?: string;
  history: HistoryEntry[];
};

export type { Format };
