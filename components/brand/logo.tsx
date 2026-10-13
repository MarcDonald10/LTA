import Image from "next/image";
import Link from "next/link";
import dark from "@/public/brand/lta-logo-dark.png";
import light from "@/public/brand/lta-logo-light.png";

/*
 * Logo LTA + mention « le mag » alignée sur le bord gauche du rectangle.
 * Version provisoire : à remplacer par le fichier définitif d'Arnauld.
 *  - "dark"  : pour fond violet (« about » et « le mag » en crème)
 *  - "light" : pour fond clair (« about » et « le mag » en violet)
 */
export function Logo({
  variant = "dark",
  width = 160,
  href = "/mag",
  priority = false,
}: {
  variant?: "dark" | "light";
  width?: number;
  href?: string;
  priority?: boolean;
}) {
  const src = variant === "dark" ? dark : light;
  const mention = variant === "dark" ? "text-creme" : "text-violet";

  return (
    <Link href={href} className="inline-block" aria-label="LTA le mag, accueil">
      <Image src={src} alt="" width={width} priority={priority} sizes={`${width}px`} />
      <span
        aria-hidden="true"
        className={`mt-[0.35em] block font-display font-bold uppercase leading-none tracking-[0.04em] ${mention}`}
        style={{ fontSize: Math.max(11, Math.round(width * 0.085)) }}
      >
        le mag
      </span>
    </Link>
  );
}
