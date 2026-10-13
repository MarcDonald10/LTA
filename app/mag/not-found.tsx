import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container width="read" className="py-16 lg:py-24">
      <p className="type-label text-bordeaux">Erreur 404</p>
      <h1 className="type-h1 mt-3">Cette page n&apos;existe pas</h1>
      <p className="type-chapo mt-4">
        Le contenu a peut-être été déplacé, ou l&apos;adresse contient une faute de frappe.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/mag">Retour à l&apos;accueil du magazine</ButtonLink>
      </div>
    </Container>
  );
}
