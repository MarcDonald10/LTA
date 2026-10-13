import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const cell =
    "inline-flex min-h-11 min-w-11 items-center justify-center border-2 px-3 font-bold";

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={`${cell} border-violet hover:bg-violet hover:text-blanc`}>
          Précédent
        </Link>
      ) : null}
      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={`${cell} border-violet bg-violet text-blanc`}>
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-label={`Page ${p}`}
            className={`${cell} border-violet hover:bg-violet hover:text-blanc`}
          >
            {p}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} className={`${cell} border-violet hover:bg-violet hover:text-blanc`}>
          Suivant
        </Link>
      ) : null}
    </nav>
  );
}
