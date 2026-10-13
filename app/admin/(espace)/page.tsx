import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/editorial";
import { FormMessage } from "@/components/ui/field";
import { listContents, type ContentRow } from "@/features/admin/queries";
import { AdminPageSkeleton, StatusBadge, formatDateTime } from "@/features/admin/ui";
import { requireUser } from "@/lib/auth/current-user";
import { STATUS_LABELS, hasRole, type SessionUser } from "@/lib/auth/roles";
import type { ContentStatus } from "@/lib/content/types";
import { FORMATS, getRubrique } from "@/lib/rubriques";

export const metadata: Metadata = { title: "Contenus" };

type SP = PageProps<"/admin">["searchParams"];

export default function DashboardPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

const STATUSES: ContentStatus[] = ["draft", "review", "approved", "published"];

async function Dashboard({ searchParams }: { searchParams: SP }) {
  const user = await requireUser();
  const sp = await searchParams;
  const status = STATUSES.find((s) => s === sp.statut);
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const { rows, counts, todo } = await listContents(user, { status, q });

  const hrefFor = (s?: ContentStatus) => {
    const p = new URLSearchParams();
    if (s) p.set("statut", s);
    if (q) p.set("q", q);
    const str = p.toString();
    return `/admin${str ? `?${str}` : ""}`;
  };

  return (
    <Container className="py-8">
      {sp.supprime ? (
        <div className="mb-6">
          <FormMessage status="success">Le contenu a été supprimé.</FormMessage>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-h1">Contenus</h1>
          <p className="mt-1">
            {hasRole(user, "editeur")
              ? "Tous les contenus de la rédaction."
              : "Vos contenus. Les éditeurs relisent et publient."}
          </p>
        </div>
        <NewContentMenu />
      </div>

      <TodoBanner user={user} todo={todo} />

      <nav aria-label="Filtrer par statut" className="mt-8 border-b border-mauve">
        <ul className="scrollbar-none -mb-px flex overflow-x-auto">
          {[undefined, ...STATUSES].map((s) => {
            const active = s === status;
            const count = s ? counts[s] : counts.all;
            return (
              <li key={s ?? "all"} className="shrink-0">
                <Link
                  href={hrefFor(s)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-2 border-b-4 px-4 font-bold whitespace-nowrap ${
                    active ? "border-bordeaux text-bordeaux" : "border-transparent hover:text-bordeaux"
                  }`}
                >
                  {s ? STATUS_LABELS[s] : "Tous"}
                  <span className="type-caption font-normal">({count})</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form role="search" action="/admin" className="mt-6 flex max-w-xl gap-2">
        {status ? <input type="hidden" name="statut" value={status} /> : null}
        <label htmlFor="recherche" className="sr-only">
          Rechercher un titre
        </label>
        <input
          id="recherche"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Rechercher un titre"
          className="min-h-11 w-full border-2 border-violet px-3 text-base"
        />
        <button type="submit" className={buttonClasses("secondary")}>
          Rechercher
        </button>
      </form>

      <div className="mt-6">
        {rows.length ? (
          <ContentList rows={rows} />
        ) : (
          <EmptyState
            title={q || status ? "Aucun contenu ne correspond" : "Aucun contenu pour l'instant"}
            action={
              q || status ? (
                <Link href="/admin" className={buttonClasses("secondary")}>
                  Effacer les filtres
                </Link>
              ) : (
                <Link href="/admin/contenus/nouveau" className={buttonClasses("primary")}>
                  Créer un premier contenu
                </Link>
              )
            }
          />
        )}
      </div>
    </Container>
  );
}

function NewContentMenu() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/admin/contenus/nouveau?format=article" className={buttonClasses("primary")}>
        Nouvel article
      </Link>
      <Link href="/admin/contenus/nouveau" className={buttonClasses("secondary")}>
        Autre format
      </Link>
    </div>
  );
}

function TodoBanner({
  user,
  todo,
}: {
  user: SessionUser;
  todo: { review?: number; approved?: number; returned?: number };
}) {
  const items: { label: string; href: string }[] = [];
  if (hasRole(user, "editeur")) {
    if (todo.review) items.push({ label: `${todo.review} à relire et vérifier`, href: "/admin?statut=review" });
    if (todo.approved) items.push({ label: `${todo.approved} validé(s) à publier`, href: "/admin?statut=approved" });
  } else if (todo.returned) {
    items.push({ label: `${todo.returned} renvoyé(s) avec des demandes de modification`, href: "/admin?statut=draft" });
  }
  if (!items.length) return null;

  return (
    <section aria-labelledby="a-traiter" className="mt-6 border-l-4 border-bordeaux bg-creme px-5 py-4">
      <h2 id="a-traiter" className="type-label">
        À traiter
      </h2>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="link font-bold">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContentList({ rows }: { rows: ContentRow[] }) {
  return (
    <>
      {/* Mobile : cartes */}
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id} className="relative border border-mauve p-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={r.status} />
              <span className="type-caption">
                {getRubrique(r.rubrique)?.name} · {FORMATS[r.format].label}
              </span>
            </div>
            <Link href={`/admin/contenus/${r.id}`} className="mt-2 block font-bold after:absolute after:inset-0">
              {r.title || "Sans titre"}
            </Link>
            {r.reviewNote && r.status === "draft" ? (
              <p className="type-caption mt-1 font-bold text-bordeaux">Modifications demandées</p>
            ) : null}
            <p className="type-caption mt-1">
              {r.authorName} · modifié le {formatDateTime(r.editedAt)}
            </p>
          </li>
        ))}
      </ul>

      {/* Ordinateur : tableau */}
      <table className="hidden w-full border-collapse text-left text-[0.9375rem] md:table">
        <caption className="sr-only">Liste des contenus</caption>
        <thead>
          <tr className="border-b-2 border-violet">
            <th scope="col" className="py-3 pr-4">Titre</th>
            <th scope="col" className="py-3 pr-4">Statut</th>
            <th scope="col" className="py-3 pr-4">Rubrique</th>
            <th scope="col" className="py-3 pr-4">Format</th>
            <th scope="col" className="py-3 pr-4">Auteur</th>
            <th scope="col" className="py-3">Modifié</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-mauve hover:bg-creme/40">
              <td className="py-3 pr-4">
                <Link href={`/admin/contenus/${r.id}`} className="link font-bold">
                  {r.title || "Sans titre"}
                </Link>
                {r.reviewNote && r.status === "draft" ? (
                  <span className="type-caption ml-2 font-bold text-bordeaux">Modifications demandées</span>
                ) : null}
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="py-3 pr-4">{getRubrique(r.rubrique)?.name}</td>
              <td className="py-3 pr-4">{FORMATS[r.format].label}</td>
              <td className="py-3 pr-4">{r.authorName}</td>
              <td className="py-3 whitespace-nowrap">{formatDateTime(r.editedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
