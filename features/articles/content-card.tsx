import Link from "next/link";
import { FormatLabel, RubriqueTag, SponsoredTag } from "@/components/ui/tag";
import type { ContentSummary } from "@/lib/content/types";
import { getRubrique } from "@/lib/rubriques";
import { formatDate } from "@/lib/site";
import { CoverImage } from "./cover-image";

export function contentHref(c: Pick<ContentSummary, "rubrique" | "slug">) {
  return `/mag/${c.rubrique}/${c.slug}`;
}

/**
 * Carte d'article : image en haut, étiquette, titre Akira, date et auteur 13 px.
 * Toute la carte est cliquable via le lien du titre (zone étendue).
 */
export function ContentCard({
  content,
  headingLevel = "h3",
  showChapo = false,
}: {
  content: ContentSummary;
  headingLevel?: "h2" | "h3";
  showChapo?: boolean;
}) {
  const rubrique = getRubrique(content.rubrique)!;
  const Heading = headingLevel;

  return (
    <article className="group relative flex flex-col">
      <CoverImage
        image={content.cover}
        rubrique={content.rubrique}
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <RubriqueTag rubrique={rubrique} />
        <FormatLabel format={content.format} />
        {content.sponsoredBy ? <SponsoredTag /> : null}
      </div>
      <Heading className="type-card-title mt-3">
        <Link
          href={contentHref(content)}
          className="after:absolute after:inset-0 group-hover:text-bordeaux"
        >
          {content.title}
        </Link>
      </Heading>
      {showChapo ? <p className="mt-2 line-clamp-3 text-base">{content.chapo}</p> : null}
      <p className="type-caption mt-2">
        <time dateTime={content.publishedAt}>{formatDate(content.publishedAt)}</time>
        {" · "}
        {content.authorName}
      </p>
    </article>
  );
}

export function ContentGrid({ items }: { items: ContentSummary[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ContentCard content={item} showChapo />
        </li>
      ))}
    </ul>
  );
}

export function ContentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="grid animate-pulse gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="aspect-video bg-violet/10" />
          <div className="mt-4 h-6 w-20 bg-violet/10" />
          <div className="mt-3 h-5 w-full bg-violet/10" />
          <div className="mt-2 h-5 w-2/3 bg-violet/10" />
        </li>
      ))}
    </ul>
  );
}
