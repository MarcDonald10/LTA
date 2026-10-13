export const SITE = {
  name: "LTA le mag",
  description:
    "Le magazine de LET'S TALK ABOUT : un regard exigeant sur la pop culture camerounaise.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  instagram: "https://www.instagram.com/letstalkabout_lta/",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, SITE.url).toString();
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Douala",
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}
