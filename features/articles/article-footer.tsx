import Link from "next/link";
import { Rule } from "@/components/ui/editorial";
import type { Correction, Source } from "@/lib/content/types";
import { formatDate } from "@/lib/site";

export function SourcesList({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <section aria-labelledby="sources">
      <h2 id="sources" className="type-h3">
        Sources
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-base">
        {sources.map((s) => (
          <li key={s.label}>
            {s.url ? (
              <a href={s.url} className="link">
                {s.label}
              </a>
            ) : (
              s.label
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <section aria-labelledby="mots-cles">
      <h2 id="mots-cles" className="type-label">
        Mots-clés
      </h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t} className="border border-mauve px-2 py-1 text-[0.9375rem]">
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Journal des corrections, visible dès qu'une erreur a été corrigée. */
export function CorrectionsLog({ corrections }: { corrections?: Correction[] }) {
  if (!corrections?.length) return null;
  return (
    <section aria-labelledby="corrections" className="border-l-4 border-violet pl-4">
      <h2 id="corrections" className="type-h3">
        Journal des corrections
      </h2>
      <ul className="mt-3 space-y-2 text-base">
        {corrections.map((c) => (
          <li key={c.date}>
            <time dateTime={c.date} className="font-bold">
              {formatDate(c.date)}
            </time>{" "}
            : {c.text}
          </li>
        ))}
      </ul>
      <Rule className="mt-4" />
      <p className="type-caption mt-2">
        Nos règles de correction sont détaillées dans la{" "}
        <Link href="/mag/charte-editoriale" className="link">
          charte éditoriale
        </Link>
        .
      </p>
    </section>
  );
}
