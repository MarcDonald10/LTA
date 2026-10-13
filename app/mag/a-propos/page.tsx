import type { Metadata } from "next";
import Link from "next/link";
import { ServicePage, ToComplete } from "@/components/layout/service-page";
import { RUBRIQUES } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "À propos",
  description: "La mission de LTA le mag, le média de LET'S TALK ABOUT.",
  alternates: { canonical: "/mag/a-propos" },
};

export default function AboutPage() {
  return (
    <ServicePage
      title="À propos"
      href="/mag/a-propos"
      intro="LTA le mag est le média de LET'S TALK ABOUT. Sa mission : porter un regard exigeant sur la pop culture camerounaise et donner la parole à celles et ceux qui la font."
    >
      <h2 className="type-h2 rule-top">Notre ligne</h2>
      <p>
        Nous publions des articles, des entretiens et des formats courts. Nous ne republions pas les
        contenus d&apos;autres médias et nous ne sommes pas un catalogue d&apos;événements : chaque
        sujet est choisi, vérifié et traité avec le temps qu&apos;il mérite.
      </p>
      <p>
        Nos sources sont citées, nos photos sont créditées et nos erreurs sont corrigées
        publiquement. Les règles sont détaillées dans notre{" "}
        <Link href="/mag/charte-editoriale">charte éditoriale</Link>.
      </p>

      <h2 className="type-h2 rule-top">Six rubriques</h2>
      <ul className="list-disc space-y-2 pl-5">
        {RUBRIQUES.map((r) => (
          <li key={r.slug}>
            <Link href={`/mag/${r.slug}`}>{r.name}</Link> : {r.description}
          </li>
        ))}
      </ul>

      <h2 className="type-h2 rule-top">L&apos;équipe</h2>
      <p>
        <ToComplete>direction éditoriale, rédaction, production multimédia, diffusion</ToComplete>
      </p>

      <h2 className="type-h2 rule-top">LET&apos;S TALK ABOUT</h2>
      <p>
        LTA le mag fait partie de LET&apos;S TALK ABOUT.{" "}
        <ToComplete>présentation de l&apos;association et lien vers le site LTA</ToComplete>
      </p>
    </ServicePage>
  );
}
