import Link from "next/link";
import type { Rubrique } from "@/lib/rubriques";
import { FORMATS, type Format } from "@/lib/rubriques";

const rubriqueTag = "type-label inline-block bg-bordeaux px-2 py-1 text-blanc";

/** Étiquette de rubrique : petit rectangle bordeaux, reprise du logo. */
export function RubriqueTag({ rubrique, link = false }: { rubrique: Rubrique; link?: boolean }) {
  if (link) {
    return (
      <Link href={`/mag/${rubrique.slug}`} className={`${rubriqueTag} hover:bg-bordeaux-fonce`}>
        {rubrique.label}
      </Link>
    );
  }
  return <span className={rubriqueTag}>{rubrique.label}</span>;
}

/** Contenu sponsorisé : étiquette crème, contour mauve, jamais au style éditorial. */
export function SponsoredTag({ partner }: { partner?: string }) {
  return (
    <span className="type-label inline-block border border-mauve bg-creme px-2 py-[3px] text-violet">
      Contenu sponsorisé{partner ? ` · ${partner}` : ""}
    </span>
  );
}

export function FormatLabel({ format }: { format: Format }) {
  if (format === "article") return null;
  return (
    <span className="type-label inline-block border border-violet px-2 py-[3px] text-violet">
      {FORMATS[format].label}
    </span>
  );
}
