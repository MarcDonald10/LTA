import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { RUBRIQUES } from "@/lib/rubriques";
import { SITE } from "@/lib/site";

const SERVICE_LINKS = [
  { href: "/mag/a-propos", label: "À propos" },
  { href: "/mag/charte-editoriale", label: "Charte éditoriale" },
  { href: "/mag/mentions-legales", label: "Mentions légales et confidentialité" },
];

export function SiteFooter() {
  const linkClass = "text-blanc underline-offset-4 hover:text-creme hover:underline";

  return (
    <footer className="on-dark mt-auto bg-violet text-blanc">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="lg:col-span-2">
          <Logo variant="dark" width={180} />
          <p className="mt-6 max-w-sm text-base text-creme">{SITE.description}</p>
        </div>

        <nav aria-labelledby="footer-rubriques">
          <h2 id="footer-rubriques" className="type-label text-creme">
            Rubriques
          </h2>
          <ul className="mt-4 space-y-2 text-base">
            {RUBRIQUES.map((r) => (
              <li key={r.slug}>
                <Link href={`/mag/${r.slug}`} className={linkClass}>
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <nav aria-labelledby="footer-service">
            <h2 id="footer-service" className="type-label text-creme">
              Le magazine
            </h2>
            <ul className="mt-4 space-y-2 text-base">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#newsletter" className={linkClass}>
                  Newsletter
                </a>
              </li>
            </ul>
          </nav>
          <h2 className="type-label mt-8 text-creme">Suivre LTA</h2>
          <ul className="mt-4 space-y-2 text-base">
            <li>
              <a href={SITE.instagram} className={linkClass} rel="noopener" target="_blank">
                Instagram <span className="sr-only">(nouvel onglet)</span>
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-mauve">
        <Container className="type-caption py-4 text-creme">
          © <CurrentYear /> LET&apos;S TALK ABOUT. Tous droits réservés.
        </Container>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
