import type { Metadata } from "next";
import { ServicePage } from "@/components/layout/service-page";
import { KeyPoints } from "@/components/ui/editorial";

export const metadata: Metadata = {
  title: "Charte éditoriale",
  description:
    "Vérification des faits, corrections, crédits et contenu sponsorisé : les règles de LTA le mag.",
  alternates: { canonical: "/mag/charte-editoriale" },
};

export default function EditorialCharterPage() {
  return (
    <ServicePage
      title="Charte éditoriale"
      href="/mag/charte-editoriale"
      intro="Ce que nos lecteurs sont en droit d'attendre de nous : des faits vérifiés, des sources citées, des erreurs corrigées en toute transparence."
    >
      <KeyPoints
        title="En bref"
        items={[
          "Aucun contenu n'est publié sans la validation d'un éditeur.",
          "Chaque article cite ses sources ; chaque image est créditée.",
          "Toute correction est signalée dans le journal en bas de l'article.",
          "Le contenu sponsorisé est toujours signalé, en haut de page.",
        ]}
      />

      <h2 className="type-h2 rule-top">Vérification des faits</h2>
      <p>
        Chaque contenu suit un circuit de validation : rédaction, relecture et vérification des faits
        par un éditeur, validation finale, puis publication. Les informations sont recoupées auprès
        de sources identifiables, citées en fin d&apos;article.
      </p>

      <h2 className="type-h2 rule-top">Corrections</h2>
      <p>
        Lorsqu&apos;une erreur est constatée après publication, nous la corrigeons et l&apos;indiquons
        dans le journal des corrections de l&apos;article, avec la date et la nature de la
        modification. Nous ne supprimons pas une erreur sans le dire.
      </p>

      <h2 className="type-h2 rule-top">Images et droits</h2>
      <p>
        Nous ne publions aucune image sans droit d&apos;utilisation. Chaque photo, illustration ou
        extrait porte le crédit de son auteur. Les contributeurs externes signent un accord écrit
        sur la cession de leurs droits.
      </p>

      <h2 className="type-h2 rule-top">Contenu sponsorisé</h2>
      <p>
        Un contenu financé par un partenaire porte la mention « Contenu sponsorisé » en haut de
        l&apos;article et sur sa carte, avec le nom du partenaire. Il suit une présentation distincte
        et n&apos;est jamais confondu avec le travail éditorial de la rédaction.
      </p>
    </ServicePage>
  );
}
