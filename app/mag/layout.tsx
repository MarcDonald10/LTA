import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsletterSection } from "@/features/newsletter/newsletter-section";

export default function MagLayout({ children }: LayoutProps<"/mag">) {
  return (
    <>
      <SiteHeader />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <NewsletterSection />
      <SiteFooter />
    </>
  );
}
