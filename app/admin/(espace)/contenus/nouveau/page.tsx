import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { ContentForm } from "@/features/admin/content-form";
import { emptyValues } from "@/features/admin/content-values";
import { listDeepDiveOptions } from "@/features/admin/queries";
import { AdminPageSkeleton } from "@/features/admin/ui";
import { requireUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/roles";
import { FORMATS, type Format } from "@/lib/rubriques";

export const metadata: Metadata = { title: "Nouveau contenu" };

const FORMAT_HELP: Record<Format, string> = {
  article: "Article éditorial : enquête, portrait, analyse, critique.",
  entretien: "Entretien en texte, avec une vidéo et des extraits clés.",
  court: "Citation commentée ou vidéo verticale, avec un lien vers un contenu approfondi.",
};

export default function NewContentPage({ searchParams }: PageProps<"/admin/contenus/nouveau">) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <NewContent searchParams={searchParams} />
    </Suspense>
  );
}

async function NewContent({ searchParams }: Pick<PageProps<"/admin/contenus/nouveau">, "searchParams">) {
  const user = await requireUser();
  const sp = await searchParams;
  const format = (Object.keys(FORMATS) as Format[]).find((f) => f === sp.format);

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Contenus", href: "/admin" },
          { label: "Nouveau contenu", href: "/admin/contenus/nouveau" },
        ]}
      />
      <h1 className="type-h1 mt-4">{format ? `Nouveau : ${FORMATS[format].label.toLowerCase()}` : "Quel format ?"}</h1>

      {format ? (
        <div className="mt-6">
          <ContentForm
            status="draft"
            initialValues={emptyValues(format, user.authorSlug)}
            deepDiveOptions={await listDeepDiveOptions()}
            permissions={{
              edit: true,
              submit: false,
              requestChanges: false,
              approve: false,
              publish: false,
              unpublish: false,
              chooseAuthor: can.chooseAuthor(user),
              markSponsored: can.markSponsored(user),
            }}
          />
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {(Object.keys(FORMATS) as Format[]).map((f) => (
            <li key={f}>
              <Link
                href={`/admin/contenus/nouveau?format=${f}`}
                className="block h-full border-2 border-violet p-6 hover:bg-creme"
              >
                <span className="type-card-title block">{FORMATS[f].label}</span>
                <span className="mt-2 block text-base">{FORMAT_HELP[f]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
