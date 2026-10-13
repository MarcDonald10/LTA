import type { Metadata } from "next";
import { ServicePage, ToComplete } from "@/components/layout/service-page";

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  description: "Mentions légales, politique de confidentialité et cookies de LTA le mag.",
  alternates: { canonical: "/mag/mentions-legales" },
};

export default function LegalPage() {
  return (
    <ServicePage
      title="Mentions légales"
      href="/mag/mentions-legales"
      intro="Informations légales, politique de confidentialité et politique de cookies de LTA le mag."
    >
      <h2 className="type-h2 rule-top">Éditeur</h2>
      <p>
        <ToComplete>raison sociale de LET&apos;S TALK ABOUT, adresse, responsable de la publication</ToComplete>
      </p>

      <h2 className="type-h2 rule-top">Hébergement</h2>
      <p>
        <ToComplete>nom et adresse de l&apos;hébergeur</ToComplete>
      </p>

      <h2 className="type-h2 rule-top" id="confidentialite">
        Confidentialité
      </h2>
      <p>
        Nous collectons votre adresse e-mail uniquement si vous vous inscrivez à la newsletter ou
        utilisez un formulaire du site, avec votre consentement explicite. Elle sert à vous envoyer
        la newsletter ou à répondre à votre demande, et n&apos;est jamais revendue.
      </p>
      <p>
        Vous pouvez vous désinscrire à tout moment depuis chaque newsletter, et demander la
        suppression de vos données en écrivant à{" "}
        <ToComplete>adresse e-mail de contact</ToComplete>.
      </p>

      <h2 className="type-h2 rule-top" id="cookies">
        Cookies
      </h2>
      <p>
        <ToComplete>outil de mesure d&apos;audience retenu ; sans cookie, aucun bandeau de consentement n&apos;est nécessaire</ToComplete>
      </p>
    </ServicePage>
  );
}
