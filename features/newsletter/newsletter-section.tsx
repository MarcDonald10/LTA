import { Container } from "@/components/ui/container";
import { NewsletterForm } from "./newsletter-form";

export function NewsletterSection() {
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="on-dark scroll-mt-4 bg-violet text-blanc">
      <Container className="grid gap-8 border-b border-mauve py-12 lg:grid-cols-2 lg:items-center lg:py-16">
        <div>
          <h2 id="newsletter-title" className="type-h2 text-creme">
            La newsletter
          </h2>
          <p className="mt-3 max-w-md text-blanc">
            Le meilleur de la pop culture camerounaise, choisi par la rédaction. Un e-mail, pas plus
            d&apos;une fois par semaine.
          </p>
        </div>
        <NewsletterForm />
      </Container>
    </section>
  );
}
