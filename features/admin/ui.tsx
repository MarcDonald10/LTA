import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { STATUS_LABELS } from "@/lib/auth/roles";
import type { ContentStatus, HistoryEntry } from "@/lib/content/types";

const STATUS_STYLE: Record<ContentStatus, string> = {
  draft: "border border-violet text-violet",
  review: "border border-violet bg-creme text-violet",
  approved: "bg-violet text-blanc",
  published: "bg-bordeaux text-blanc",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`type-label inline-block px-2 py-1 whitespace-nowrap ${STATUS_STYLE[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const ACTION_LABELS: Record<HistoryEntry["action"], string> = {
  created: "a créé le contenu",
  saved: "a enregistré des modifications",
  submitted: "a envoyé en relecture",
  changes_requested: "a demandé des modifications",
  approved: "a validé le contenu",
  published: "a publié le contenu",
  unpublished: "a retiré le contenu du site",
  corrected: "a publié une correction",
};

const dateTime = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Douala",
});

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso));
}

/** Historique du contenu, du plus récent au plus ancien. Les enregistrements simples sont regroupés. */
export function HistoryList({ history }: { history: HistoryEntry[] }) {
  const entries = [...history]
    .reverse()
    .filter((e, i, all) => !(e.action === "saved" && all[i - 1]?.action === "saved" && all[i - 1]?.userId === e.userId));

  return (
    <ol className="space-y-3 text-[0.9375rem] leading-6">
      {entries.slice(0, 12).map((e, i) => (
        <li key={`${e.at}-${i}`} className="border-l-2 border-mauve pl-3">
          <span className="font-bold">{e.userName}</span> {ACTION_LABELS[e.action]}
          <br />
          <time dateTime={e.at} className="type-caption">
            {formatDateTime(e.at)}
          </time>
          {e.note ? <p className="mt-1 bg-creme px-2 py-1">« {e.note} »</p> : null}
        </li>
      ))}
    </ol>
  );
}

export function AccessDenied({ message }: { message: string }) {
  return (
    <Container width="read" className="py-16">
      <p className="type-label text-bordeaux">Accès refusé</p>
      <h1 className="type-h1 mt-3">Vous n&apos;avez pas accès à cette page</h1>
      <p className="mt-4">{message}</p>
      <Link href="/admin" className={buttonClasses("secondary", "mt-8")}>
        Retour aux contenus
      </Link>
    </Container>
  );
}

export function AdminPageSkeleton() {
  return (
    <Container className="animate-pulse py-8" aria-hidden="true">
      <div className="h-9 w-64 max-w-full bg-violet/10" />
      <div className="mt-8 h-11 w-full bg-violet/10" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-16 w-full bg-violet/10" />
        ))}
      </div>
    </Container>
  );
}
