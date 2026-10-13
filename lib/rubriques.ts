export const RUBRIQUES = [
  {
    key: "music",
    slug: "musique",
    name: "LTA Music",
    label: "MUSIC",
    description:
      "Artistes, scènes et sons qui font la musique camerounaise d'aujourd'hui.",
  },
  {
    key: "screen",
    slug: "ecran",
    name: "LTA Screen",
    label: "SCREEN",
    description:
      "Cinéma, séries, web-séries : les récits camerounais à l'écran et ceux qui les fabriquent.",
  },
  {
    key: "geek",
    slug: "geek",
    name: "LTA Geek",
    label: "GEEK",
    description:
      "Jeu vidéo, manga, BD et cultures geek, vus depuis Douala, Yaoundé et au-delà.",
  },
  {
    key: "creative",
    slug: "creatif",
    name: "LTA Creative",
    label: "CREATIVE",
    description:
      "Mode, design, arts visuels : les créatrices et créateurs qui inventent une esthétique.",
  },
  {
    key: "digital",
    slug: "digital",
    name: "LTA Digital",
    label: "DIGITAL",
    description:
      "Créateurs de contenu, plateformes et usages numériques qui transforment la culture.",
  },
  {
    key: "perspectives",
    slug: "perspectives",
    name: "LTA Perspectives",
    label: "PERSPECTIVES",
    description:
      "Analyses, tribunes et grands entretiens pour prendre du recul sur la pop culture.",
  },
] as const;

export type Rubrique = (typeof RUBRIQUES)[number];
export type RubriqueSlug = Rubrique["slug"];

export function getRubrique(slug: string): Rubrique | undefined {
  return RUBRIQUES.find((r) => r.slug === slug);
}

export const FORMATS = {
  article: { label: "Article", plural: "Articles", param: "articles" },
  entretien: { label: "Entretien", plural: "Entretiens", param: "entretiens" },
  court: { label: "Format court", plural: "Formats courts", param: "courts" },
} as const;

export type Format = keyof typeof FORMATS;

export function formatFromParam(param: string | undefined): Format | undefined {
  return (Object.keys(FORMATS) as Format[]).find(
    (f) => FORMATS[f].param === param,
  );
}
