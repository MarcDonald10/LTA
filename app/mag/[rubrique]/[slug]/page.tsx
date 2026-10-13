import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PullQuote, Rule, SectionHeading } from "@/components/ui/editorial";
import { FormatLabel, RubriqueTag, SponsoredTag } from "@/components/ui/tag";
import { ArticleBlocks } from "@/features/articles/article-blocks";
import { CorrectionsLog, SourcesList, TagList } from "@/features/articles/article-footer";
import { ContentGrid, contentHref } from "@/features/articles/content-card";
import { CoverImage, ImageCredit } from "@/features/articles/cover-image";
import { ShareButtons } from "@/features/articles/share-buttons";
import { VideoPlayer } from "@/features/articles/video-player";
import { getAllContentPaths, getContent } from "@/lib/content/repository";
import type { Author, Content } from "@/lib/content/types";
import { getRubrique } from "@/lib/rubriques";
import { SITE, absoluteUrl, formatDate } from "@/lib/site";

type Props = PageProps<"/mag/[rubrique]/[slug]">;

export async function generateStaticParams() {
  const paths = await getAllContentPaths();
  return paths.map(({ rubrique, slug }) => ({ rubrique, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rubrique, slug } = await params;
  const data = await getContent(rubrique, slug);
  if (!data) return {};
  const { content, author } = data;
  const path = contentHref(content);

  return {
    title: content.title,
    description: content.chapo,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: content.title,
      description: content.chapo,
      publishedTime: content.publishedAt,
      modifiedTime: content.updatedAt,
      authors: author ? [author.name] : undefined,
      section: getRubrique(content.rubrique)?.name,
      tags: content.tags,
      images: content.cover.src
        ? [{ url: content.cover.src, alt: content.cover.alt }]
        : [{ url: "/brand/og-default.png", width: 1200, height: 630, alt: SITE.name }],
    },
  };
}

// Coquille instantanée ; le contenu, qui dépend de l'URL, arrive en streaming.
export default function ContentPage({ params }: Props) {
  return (
    <Suspense fallback={<ArticleFallback />}>
      <ContentView params={params} />
    </Suspense>
  );
}

function ArticleFallback() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <Container className="pt-6 lg:pt-10">
        <div className="h-4 w-56 max-w-full bg-violet/10" />
      </Container>
      <Container width="read" className="mt-8">
        <div className="h-6 w-20 bg-violet/10" />
        <div className="mt-4 h-8 w-full bg-violet/10" />
        <div className="mt-2 h-8 w-2/3 bg-violet/10" />
        <div className="mt-4 h-20 w-full bg-violet/10" />
      </Container>
      <Container className="mt-8 mb-16">
        <div className="aspect-video w-full bg-violet/10" />
      </Container>
    </div>
  );
}

async function ContentView({ params }: Pick<Props, "params">) {
  const { rubrique: rubriqueSlug, slug } = await params;
  const data = await getContent(rubriqueSlug, slug);
  if (!data) notFound();

  const { content, author, related, deepDive } = data;
  const rubrique = getRubrique(content.rubrique)!;
  const path = contentHref(content);

  return (
    <article>
      <ArticleJsonLd content={content} author={author} path={path} />

      <Container className="pt-6 lg:pt-10">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/mag" },
            { label: rubrique.name, href: `/mag/${rubrique.slug}` },
            { label: content.title, href: path },
          ]}
        />
      </Container>

      {/* En-tête : étiquettes, titre, chapô, signature */}
      <Container width="read" className="mt-8">
        {content.sponsoredBy ? (
          <div className="mb-4">
            <SponsoredTag partner={content.sponsoredBy} />
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <RubriqueTag rubrique={rubrique} link />
          <FormatLabel format={content.format} />
        </div>
        <h1 className="type-h1 mt-4">{content.title}</h1>
        <p className="type-chapo mt-4">{content.chapo}</p>
        <p className="type-caption mt-6 border-t border-mauve pt-4">
          Par <span className="font-bold">{author?.name ?? "La rédaction"}</span>
          {" · "}
          <time dateTime={content.publishedAt}>{formatDate(content.publishedAt)}</time>
          {content.updatedAt ? (
            <>
              {" · Mis à jour le "}
              <time dateTime={content.updatedAt}>{formatDate(content.updatedAt)}</time>
            </>
          ) : null}
        </p>
      </Container>

      {/* Image de une, pleine largeur de page, crédit dessous */}
      {content.format !== "court" ? (
        <Container className="mt-8">
          <figure>
            <CoverImage
              image={content.cover}
              rubrique={content.rubrique}
              sizes="(min-width: 1200px) 1136px, 100vw"
              priority
            />
            <figcaption>
              <ImageCredit image={content.cover} />
            </figcaption>
          </figure>
        </Container>
      ) : null}

      <Container width="read" className="mt-10">
        <FormatSpecific content={content} />
        <ArticleBlocks blocks={content.body} rubrique={content.rubrique} />

        {deepDive ? (
          <div className="mt-10 bg-creme p-6">
            <p className="type-label">Pour aller plus loin</p>
            <p className="type-card-title mt-2">{deepDive.title}</p>
            <ButtonLink href={contentHref(deepDive)} className="mt-4">
              Lire le contenu complet
            </ButtonLink>
          </div>
        ) : null}

        <div className="mt-12 space-y-8">
          <ShareButtons path={path} title={content.title} />
          <Rule />
          <SourcesList sources={content.sources} />
          <TagList tags={content.tags} />
          <CorrectionsLog corrections={content.corrections} />
        </div>
      </Container>

      {related.length ? (
        <Container className="mt-16 mb-16">
          <section aria-labelledby="a-lire-aussi">
            <SectionHeading id="a-lire-aussi" href={`/mag/${rubrique.slug}`} linkLabel={`Tout ${rubrique.name}`}>
              À lire aussi
            </SectionHeading>
            <ContentGrid items={related} />
          </section>
        </Container>
      ) : (
        <div className="mb-16" />
      )}
    </article>
  );
}

function FormatSpecific({ content }: { content: Content }) {
  if (content.format === "entretien") {
    return (
      <div className="mb-10 space-y-8">
        {content.media ? <VideoPlayer video={content.media} /> : null}
        {content.excerpts.length ? (
          <section aria-labelledby="extraits" className="bg-creme p-6">
            <h2 id="extraits" className="type-h3">
              Extraits clés
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {content.excerpts.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <p className="type-label">Avec {content.guest}</p>
      </div>
    );
  }

  if (content.format === "court") {
    return (
      <div className="mb-8 space-y-6">
        {content.quote ? <PullQuote text={content.quote.text} cite={content.quote.author} /> : null}
        {content.media ? <VideoPlayer video={{ ...content.media, vertical: true }} /> : null}
      </div>
    );
  }

  return null;
}

function ArticleJsonLd({ content, author, path }: { content: Content; author?: Author; path: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.chapo,
    datePublished: content.publishedAt,
    dateModified: content.updatedAt ?? content.publishedAt,
    mainEntityOfPage: absoluteUrl(path),
    articleSection: getRubrique(content.rubrique)?.name,
    keywords: content.tags.join(", "),
    image: content.cover.src ? [absoluteUrl(content.cover.src)] : undefined,
    author: {
      "@type": author?.slug === "redaction" ? "Organization" : "Person",
      name: author?.name ?? "La rédaction",
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/lta-logo-light.png") },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
