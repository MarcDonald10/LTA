import type { Metadata } from "next";
import Link from "next/link";
import { RubriqueIcon } from "@/components/brand/rubrique-icon";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState, SectionHeading } from "@/components/ui/editorial";
import { FormatLabel, RubriqueTag, SponsoredTag } from "@/components/ui/tag";
import { CoverImage } from "@/features/articles/cover-image";
import { ContentGrid, contentHref } from "@/features/articles/content-card";
import { getHomeContent } from "@/lib/content/repository";
import type { ContentSummary } from "@/lib/content/types";
import { RUBRIQUES, getRubrique } from "@/lib/rubriques";
import { SITE, formatDate } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} · La pop culture camerounaise` },
  alternates: { canonical: "/mag" },
};

export default async function MagHome() {
  const { featured, interview, latest } = await getHomeContent();

  return (
    <>
      <h1 className="sr-only">LTA le mag, la pop culture camerounaise</h1>

      {featured ? (
        <Container className="pt-8 lg:pt-12">
          <Lead content={featured} />
        </Container>
      ) : (
        <Container className="py-12">
          <EmptyState title="Les premiers contenus arrivent bientôt">
            <p>La rédaction prépare les premiers articles du magazine.</p>
          </EmptyState>
        </Container>
      )}

      {latest.length ? (
        <Container className="py-12 lg:py-16">
          <section aria-labelledby="derniers">
            <SectionHeading id="derniers">Derniers contenus</SectionHeading>
            <ContentGrid items={latest} />
          </section>
        </Container>
      ) : null}

      {interview ? (
        <section aria-labelledby="entretien" className="bg-creme">
          <Container className="py-12 lg:py-16">
            <SectionHeading id="entretien">L&apos;entretien du moment</SectionHeading>
            <InterviewHighlight content={interview} />
          </Container>
        </section>
      ) : null}

      <Container className="py-12 lg:py-16">
        <section aria-labelledby="rubriques">
          <SectionHeading id="rubriques">Les six rubriques</SectionHeading>
          <ul className="grid gap-px border border-mauve bg-mauve sm:grid-cols-2 lg:grid-cols-3">
            {RUBRIQUES.map((r) => (
              <li key={r.slug} className="bg-blanc">
                <Link
                  href={`/mag/${r.slug}`}
                  className="group flex h-full gap-4 p-6 hover:bg-creme/40"
                >
                  <RubriqueIcon rubrique={r} className="mt-1 shrink-0 text-bordeaux" />
                  <span>
                    <span className="type-card-title block group-hover:text-bordeaux">{r.name}</span>
                    <span className="mt-2 block text-base">{r.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}

/** À la une : grande image et titre à côté (jamais posé sur la photo). */
function Lead({ content }: { content: ContentSummary }) {
  const rubrique = getRubrique(content.rubrique)!;
  return (
    <article className="group relative grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <CoverImage
          image={content.cover}
          rubrique={content.rubrique}
          sizes="(min-width: 1200px) 680px, (min-width: 1024px) 58vw, 100vw"
          priority
        />
      </div>
      <div className="lg:col-span-5 lg:self-center">
        <p className="type-label text-bordeaux">À la une</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <RubriqueTag rubrique={rubrique} />
          <FormatLabel format={content.format} />
          {content.sponsoredBy ? <SponsoredTag /> : null}
        </div>
        <h2 className="type-h1 mt-4">
          <Link href={contentHref(content)} className="after:absolute after:inset-0 group-hover:text-bordeaux">
            {content.title}
          </Link>
        </h2>
        <p className="type-chapo mt-4">{content.chapo}</p>
        <p className="type-caption mt-4">
          <time dateTime={content.publishedAt}>{formatDate(content.publishedAt)}</time>
          {" · "}
          {content.authorName}
        </p>
      </div>
    </article>
  );
}

function InterviewHighlight({ content }: { content: ContentSummary }) {
  const rubrique = getRubrique(content.rubrique)!;
  return (
    <article className="grid gap-6 lg:grid-cols-2 lg:gap-12">
      <CoverImage
        image={content.cover}
        rubrique={content.rubrique}
        sizes="(min-width: 1024px) 560px, 100vw"
      />
      <div className="lg:self-center">
        <RubriqueTag rubrique={rubrique} />
        <h3 className="type-h1 mt-4">{content.title}</h3>
        <p className="type-chapo mt-4">{content.chapo}</p>
        <ButtonLink href={contentHref(content)} className="mt-6">
          Lire et regarder l&apos;entretien
        </ButtonLink>
      </div>
    </article>
  );
}
