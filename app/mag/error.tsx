"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function MagError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container width="read" className="py-16 lg:py-24">
      <p className="type-label text-bordeaux">Erreur</p>
      <h1 className="type-h1 mt-3">Le chargement a échoué</h1>
      <p className="type-chapo mt-4">
        Votre connexion a peut-être été interrompue. Vous pouvez réessayer sans perdre votre place.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Réessayer</Button>
        <ButtonLink href="/mag" variant="secondary">
          Retour à l&apos;accueil
        </ButtonLink>
      </div>
    </Container>
  );
}
