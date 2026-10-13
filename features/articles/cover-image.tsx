import Image from "next/image";
import { RubriqueIcon } from "@/components/brand/rubrique-icon";
import type { MediaImage } from "@/lib/content/types";
import { getRubrique, type RubriqueSlug } from "@/lib/rubriques";

/**
 * Image rectangulaire 16:9 (ou 1:1). Sans photo, affiche un aplat violet
 * avec le pictogramme de la rubrique : jamais d'image sans droits.
 */
export function CoverImage({
  image,
  rubrique,
  ratio = "16/9",
  sizes,
  priority = false,
}: {
  image: MediaImage;
  rubrique: RubriqueSlug;
  ratio?: "16/9" | "1/1";
  sizes: string;
  priority?: boolean;
}) {
  const r = getRubrique(rubrique)!;
  const aspect = ratio === "16/9" ? "aspect-video" : "aspect-square";

  if (!image.src) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className={`${aspect} relative flex w-full items-center justify-center overflow-hidden bg-violet`}
      >
        <RubriqueIcon rubrique={r} size={96} className="text-mauve" />
        <span aria-hidden="true" className="absolute top-0 left-0 h-2 w-1/3 bg-bordeaux" />
      </div>
    );
  }

  return (
    <div className={`${aspect} relative w-full overflow-hidden bg-violet`}>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

/** Crédit photo sous l'image, Roboto 13/14 px. */
export function ImageCredit({ image, caption }: { image: MediaImage; caption?: string }) {
  return (
    <p className="type-caption mt-2">
      {caption ? <span>{caption} </span> : null}
      <span>© {image.credit}</span>
    </p>
  );
}
