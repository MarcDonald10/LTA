import Link from "next/link";
import type { ReactNode } from "react";

/** Titre de section : filet violet 2 px au-dessus, lien optionnel à droite. */
export function SectionHeading({
  id,
  children,
  href,
  linkLabel,
}: {
  id?: string;
  children: ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="rule-top mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h2 id={id} className="type-h2">
        {children}
      </h2>
      {href && linkLabel ? (
        <Link href={href} className="link text-[0.9375rem] font-bold">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

/** Citation mise en valeur : fond crème, trait bordeaux 4 px à gauche. */
export function PullQuote({ text, cite }: { text: string; cite?: string }) {
  return (
    <figure className="border-l-4 border-bordeaux bg-creme px-6 py-6">
      <blockquote className="text-[1.3125rem] font-medium leading-8 lg:text-2xl lg:leading-9">
        {text}
      </blockquote>
      {cite ? <figcaption className="mt-3 text-base">{cite}</figcaption> : null}
    </figure>
  );
}

/** Encadré « À retenir » : fond crème, titre Roboto Bold. */
export function KeyPoints({ title, items }: { title: string; items: string[] }) {
  return (
    <aside className="bg-creme px-6 py-6" aria-label={title}>
      <p className="type-h3">{title}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

/** Séparateur : filet 1 px mauve. */
export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-mauve ${className}`} />;
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border border-mauve px-6 py-12 text-center">
      <p className="type-h3">{title}</p>
      {children ? <div className="mx-auto mt-2 max-w-prose">{children}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
