import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RubriqueIcon } from "@/components/brand/rubrique-icon";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/editorial";
import { Pagination } from "@/components/ui/pagination";
import { ContentGrid, ContentGridSkeleton } from "@/features/articles/content-card";
import { getRubriqueContents } from "@/lib/content/repository";
import {
  FORMATS,
  RUBRIQUES,
  formatFromParam,
  getRubrique,
  type Format,
  type Rubrique,
} from "@/lib/rubriques";

export function generateStaticParams() {
  return RUBRIQUES.map((r) => ({ rubrique: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/mag/[rubrique]">): Promise<Metadata> {
  const rubrique = getRubrique((await params).rubrique);
  if (!rubrique) return {};
  return {
    title: rubrique.name,
    description: rubrique.description,
    alternates: { canonical: `/mag/${rubrique.slug}` },
  };
}

// La coquille de page ne dépend pas de l'URL : la navigation est instantanée,
// l'en-tête et la liste (qui lisent params et searchParams) arrivent en streaming.
export default function RubriquePage({ params, searchParams }: PageProps<"/mag/[rubrique]">) {
  return (
    <Container className="py-8 lg:py-12">
      <Suspense fallback={<RubriqueFallback />}>
        <RubriqueContent params={params} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function RubriqueContent({ params, searchParams }: PageProps<"/mag/[rubrique]">) {
  const rubrique = getRubrique((await params).rubrique);
  if (!rubrique) notFound();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/mag" },
          { label: rubrique.name, href: `/mag/${rubrique.slug}` },
        ]}
      />
      <header className="mt-6 max-w-read">
        <span className="inline-flex h-12 w-12 items-center justify-center bg-bordeaux text-blanc">
          <RubriqueIcon rubrique={rubrique} />
        </span>
        <h1 className="type-h1 mt-4">{rubrique.name}</h1>
        <p className="type-chapo mt-3">{rubrique.description}</p>
      </header>

      <Suspense fallback={<ListingFallback />}>
        <Listing rubrique={rubrique} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function RubriqueFallback() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-4 w-40 bg-violet/10" />
      <div className="mt-6 h-12 w-12 bg-violet/10" />
      <div className="mt-4 h-8 w-64 max-w-full bg-violet/10" />
      <div className="mt-3 h-6 w-full max-w-read bg-violet/10" />
      <ListingFallback />
    </div>
  );
}

async function Listing({
  rubrique,
  searchParams,
}: {
  rubrique: Rubrique;
  searchParams: PageProps<"/mag/[rubrique]">["searchParams"];
}) {
  const sp = await searchParams;
  const formatParam = typeof sp.format === "string" ? sp.format : undefined;
  const format = formatFromParam(formatParam);
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const { items, total, page: current, pageCount } = await getRubriqueContents(
    rubrique.slug,
    format,
    page,
  );

  const hrefFor = (f: Format | undefined, p = 1) => {
    const q = new URLSearchParams();
    if (f) q.set("format", FORMATS[f].param);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return `/mag/${rubrique.slug}${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <FormatFilter active={format} hrefFor={(f) => hrefFor(f)} />
      <p className="type-caption mb-6" aria-live="polite">
        {total} {total > 1 ? "contenus" : "contenu"}
      </p>
      {items.length ? (
        <>
          <ContentGrid items={items} />
          <Pagination page={current} pageCount={pageCount} hrefFor={(p) => hrefFor(format, p)} />
        </>
      ) : (
        <EmptyState
          title={format ? `Pas encore de ${FORMATS[format].plural.toLowerCase()} ici` : "Pas encore de contenu ici"}
          action={
            format ? (
              <Link href={hrefFor(undefined)} className={buttonClasses("secondary")}>
                Voir tous les contenus de la rubrique
              </Link>
            ) : (
              <Link href="/mag" className={buttonClasses("secondary")}>
                Retour à l&apos;accueil
              </Link>
            )
          }
        >
          <p>La rédaction prépare les prochains contenus de {rubrique.name}.</p>
        </EmptyState>
      )}
    </>
  );
}

function FormatFilter({
  active,
  hrefFor,
}: {
  active: Format | undefined;
  hrefFor: (f: Format | undefined) => string;
}) {
  const options: { format: Format | undefined; label: string }[] = [
    { format: undefined, label: "Tout" },
    ...(Object.keys(FORMATS) as Format[]).map((f) => ({ format: f, label: FORMATS[f].plural })),
  ];

  return (
    <nav aria-label="Filtrer par format" className="mt-8 mb-4 border-b border-mauve">
      <ul className="scrollbar-none -mb-px flex overflow-x-auto">
        {options.map((o) => {
          const isActive = o.format === active;
          return (
            <li key={o.label} className="shrink-0">
              <Link
                href={hrefFor(o.format)}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center border-b-4 px-4 font-bold whitespace-nowrap ${
                  isActive ? "border-bordeaux text-bordeaux" : "border-transparent hover:text-bordeaux"
                }`}
              >
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ListingFallback() {
  return (
    <div className="mt-8">
      <div className="mb-10 h-11 border-b border-mauve" />
      <ContentGridSkeleton />
      <p className="sr-only" role="status">
        Chargement des contenus…
      </p>
    </div>
  );
}
