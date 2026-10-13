import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header>
      <a
        href="#contenu"
        className="sr-only bg-creme px-4 py-2 font-bold text-violet focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        Aller au contenu
      </a>
      <div className="on-dark bg-violet">
        <Container className="flex items-center justify-between gap-4 py-4 lg:py-6">
          <Logo variant="dark" width={150} priority />
          <a
            href="#newsletter"
            className="hidden min-h-11 items-center border-2 border-creme px-4 text-[0.9375rem] font-bold text-creme hover:bg-creme hover:text-violet sm:inline-flex lg:text-base"
          >
            Newsletter
          </a>
        </Container>
      </div>
      <nav aria-label="Rubriques" className="border-b-2 border-violet bg-blanc">
        <Container>
          <NavLinks />
        </Container>
      </nav>
    </header>
  );
}
