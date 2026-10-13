import type { ReactNode } from "react";
import type { Rubrique } from "@/lib/rubriques";

/*
 * Pictogrammes linéaires des rubriques : 24 px, trait 2 px, angles droits.
 * Propositions provisoires, à remplacer par les dessins d'Arnauld.
 */
const paths: Record<Rubrique["key"], ReactNode> = {
  // Égaliseur
  music: <path d="M4 20V11M9.33 20V4M14.67 20V8M20 20v-6" />,
  // Écran
  screen: (
    <>
      <rect x="3" y="4" width="18" height="12" />
      <path d="M12 16v4M7 20h10" />
    </>
  ),
  // Manette
  geek: (
    <>
      <rect x="2" y="7" width="20" height="11" />
      <path d="M6 12.5h5M8.5 10v5M15 11h2M17 14h2" />
    </>
  ),
  // Crayon
  creative: <path d="M4 20v-4L15 5l4 4L8 20H4ZM12.5 7.5l4 4" />,
  // Smartphone
  digital: (
    <>
      <rect x="6" y="2" width="12" height="20" />
      <path d="M11 18h2" />
    </>
  ),
  // Bulle de discussion
  perspectives: <path d="M3 4h18v12H10l-5 4v-4H3V4ZM7 8h10M7 12h6" />,
};

export function RubriqueIcon({
  rubrique,
  size = 24,
  className = "",
}: {
  rubrique: Rubrique;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
    >
      {paths[rubrique.key]}
    </svg>
  );
}
