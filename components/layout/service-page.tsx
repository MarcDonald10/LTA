import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";

/** Gabarit des pages de service (à propos, charte, mentions légales). */
export function ServicePage({
  title,
  href,
  intro,
  children,
}: {
  title: string;
  href: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <Container className="pt-6 lg:pt-10">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/mag" },
            { label: title, href },
          ]}
        />
      </Container>
      <Container width="read" className="mt-8 mb-16">
        <h1 className="type-h1">{title}</h1>
        <p className="type-chapo mt-4">{intro}</p>
        <div className="article-body mt-10">{children}</div>
      </Container>
    </>
  );
}

/** Mention visible des informations encore à fournir par LTA. */
export function ToComplete({ children }: { children: ReactNode }) {
  return <mark className="bg-creme px-1 text-violet">[À compléter : {children}]</mark>;
}
