import type { Author, Content } from "./types";

/*
 * Contenus d'exemple pour développer et présenter les gabarits.
 * Tout est fictif : ils seront remplacés par les contenus de la rédaction
 * (Firestore) quand l'espace d'administration sera branché.
 */

const exampleCover = (alt: string) => ({
  alt,
  credit: "Visuel d'exemple : photo à fournir par la rédaction",
});

export const AUTHORS: Author[] = [
  {
    slug: "redaction",
    name: "La rédaction",
    role: "LTA le mag",
    bio: "L'équipe éditoriale de LTA le mag.",
  },
  {
    slug: "auteur-exemple",
    name: "Auteur d'exemple",
    role: "Rédacteur",
    bio: "Profil fictif utilisé pour tester les gabarits.",
  },
];

export const CONTENTS: Content[] = [
  {
    id: "c1",
    format: "article",
    slug: "la-nouvelle-scene-urbaine-de-douala",
    rubrique: "musique",
    title: "La nouvelle scène urbaine de Douala",
    chapo:
      "Studios de quartier, collectifs indépendants, réseaux sociaux : comment une génération d'artistes construit sa propre industrie, sans attendre les maisons de disques.",
    authorSlug: "auteur-exemple",
    publishedAt: "2026-10-12T09:00:00+01:00",
    featured: true,
    cover: exampleCover("Un artiste sur scène, éclairé en contre-jour"),
    body: [
      {
        type: "p",
        text: "Ce texte d'exemple montre la mise en page d'un article long. Le corps de texte est en Roboto, sur une colonne de 720 px au plus, pour garder des lignes de 60 à 75 caractères, confortables à lire sur téléphone comme sur ordinateur.",
      },
      {
        type: "p",
        text: "Un article éditorial s'ouvre sur un chapô, suit une progression en intertitres et cite ses sources en fin de page. Chaque photo porte son crédit, en dessous, en 13 px.",
      },
      { type: "h2", text: "Des studios plutôt que des labels" },
      {
        type: "p",
        text: "Les intertitres sont en Akira Expanded, en capitales, précédés d'un filet violet de 2 px qui renforce l'effet éditorial. Ils découpent le texte en séquences courtes, faciles à parcourir.",
      },
      {
        type: "quote",
        text: "On n'attend plus qu'on vienne nous chercher : on enregistre, on publie, et le public décide.",
        cite: "Propos d'exemple",
      },
      {
        type: "p",
        text: "La citation mise en valeur utilise un fond crème et un trait bordeaux de 4 px à gauche. Elle sert à faire respirer la lecture et à souligner une phrase forte, pas à répéter le texte.",
      },
      { type: "h3", text: "Un sous-titre en Roboto Bold" },
      {
        type: "p",
        text: "Le sous-titre de niveau 3 structure une section longue sans concurrencer les intertitres. Les liens dans le texte, comme celui vers la charte éditoriale, sont violets et soulignés.",
      },
      {
        type: "keypoints",
        title: "À retenir",
        items: [
          "Un encadré « À retenir » résume l'essentiel en trois ou quatre points.",
          "Fond crème, titre en Roboto Bold, texte violet foncé.",
          "Il ne remplace pas le chapô : il conclut une section.",
        ],
      },
      {
        type: "p",
        text: "Le journal des corrections, en bas de l'article, garde la trace de chaque erreur corrigée après publication.",
      },
    ],
    sources: [
      { label: "Entretiens menés par la rédaction (exemple)" },
      { label: "Charte éditoriale de LTA le mag", url: "/mag/charte-editoriale" },
    ],
    tags: ["scène urbaine", "Douala", "indépendants"],
    corrections: [
      {
        date: "2026-10-12T18:00:00+01:00",
        text: "Exemple de correction : le nom d'un studio avait été mal orthographié.",
      },
    ],
  },
  {
    id: "c2",
    format: "entretien",
    slug: "entretien-realisatrice-premier-long-metrage",
    rubrique: "ecran",
    title: "« Filmer Yaoundé comme un personnage »",
    guest: "Une réalisatrice (exemple)",
    chapo:
      "Rencontre avec une réalisatrice qui tourne son premier long métrage avec une équipe entièrement camerounaise. Un entretien d'exemple pour le gabarit vidéo.",
    authorSlug: "redaction",
    publishedAt: "2026-10-10T10:00:00+01:00",
    cover: exampleCover("Une réalisatrice derrière une caméra"),
    media: { provider: "youtube", id: "", title: "Entretien vidéo" },
    excerpts: [
      "Sur le choix des décors : « La ville impose son rythme au récit. »",
      "Sur l'équipe : « Former des techniciens sur le tournage fait partie du projet. »",
      "Sur la diffusion : « Les plateformes ne doivent pas être la seule porte de sortie. »",
    ],
    body: [
      {
        type: "p",
        text: "Le gabarit entretien reprend la structure de l'article, avec un lecteur vidéo ou audio et une liste d'extraits clés. La vidéo n'est chargée qu'au clic, pour préserver les connexions limitées.",
      },
      { type: "h3", text: "Comment est né le projet ?" },
      {
        type: "p",
        text: "Les questions sont en Roboto Bold, les réponses en texte courant. Exemple de réponse : l'envie de raconter la ville autrement que par les clichés habituels.",
      },
      { type: "h3", text: "Qu'attendez-vous du public ?" },
      {
        type: "p",
        text: "Exemple de réponse : qu'il se reconnaisse dans les personnages, et qu'il ait envie de voir d'autres films tournés ici.",
      },
    ],
    sources: [{ label: "Entretien réalisé par la rédaction (exemple)" }],
    tags: ["cinéma", "Yaoundé", "réalisatrices"],
  },
  {
    id: "c3",
    format: "court",
    slug: "citation-la-culture-geek-est-locale",
    rubrique: "geek",
    title: "« La culture geek est aussi locale »",
    chapo:
      "Une phrase entendue lors d'une convention, et ce qu'elle dit de la scène geek camerounaise. Format court d'exemple.",
    authorSlug: "redaction",
    publishedAt: "2026-10-09T15:00:00+01:00",
    cover: exampleCover("Des visiteurs dans une convention de jeux vidéo"),
    quote: {
      text: "On a grandi avec des mangas japonais ; maintenant on veut raconter nos propres héros.",
      author: "Un auteur de BD (exemple)",
    },
    deepDiveSlug: "jeu-video-studios-independants",
    body: [
      {
        type: "p",
        text: "Le format court commente une citation ou une vidéo verticale en quelques lignes, puis renvoie vers un contenu approfondi.",
      },
    ],
    sources: [{ label: "Propos recueillis par la rédaction (exemple)" }],
    tags: ["BD", "conventions"],
  },
  {
    id: "c4",
    format: "article",
    slug: "jeu-video-studios-independants",
    rubrique: "geek",
    title: "Jeu vidéo : les studios indépendants changent d'échelle",
    chapo:
      "De la game jam au premier jeu commercialisé, le parcours de petites équipes qui développent des jeux inspirés d'histoires camerounaises.",
    authorSlug: "auteur-exemple",
    publishedAt: "2026-10-08T09:00:00+01:00",
    cover: exampleCover("Un développeur devant deux écrans"),
    body: [
      {
        type: "p",
        text: "Article d'exemple de la rubrique Geek. Il sert de contenu approfondi pour le format court lié.",
      },
    ],
    sources: [{ label: "Source d'exemple" }],
    tags: ["jeu vidéo", "studios"],
  },
  {
    id: "c5",
    format: "article",
    slug: "mode-ateliers-qui-reinventent-le-pagne",
    rubrique: "creatif",
    title: "Les ateliers qui réinventent le pagne",
    chapo:
      "Coupes contemporaines, petites séries, vente en ligne : visite d'ateliers où le textile traditionnel devient un langage de créateur.",
    authorSlug: "auteur-exemple",
    publishedAt: "2026-10-07T09:00:00+01:00",
    cover: exampleCover("Des rouleaux de tissu dans un atelier"),
    body: [{ type: "p", text: "Article d'exemple de la rubrique Creative." }],
    sources: [{ label: "Source d'exemple" }],
    tags: ["mode", "textile"],
  },
  {
    id: "c6",
    format: "article",
    slug: "createurs-de-contenu-vivre-de-sa-communaute",
    rubrique: "digital",
    title: "Créateurs de contenu : vivre de sa communauté",
    chapo:
      "Partenariats, abonnements, événements : les modèles économiques des créateurs camerounais, et leurs limites.",
    authorSlug: "redaction",
    publishedAt: "2026-10-06T09:00:00+01:00",
    sponsoredBy: "Partenaire d'exemple",
    cover: exampleCover("Une créatrice filme une vidéo avec son téléphone"),
    body: [
      {
        type: "p",
        text: "Exemple de contenu sponsorisé : la mention apparaît en haut de l'article et sur les cartes, dans une étiquette distincte du style éditorial.",
      },
    ],
    sources: [{ label: "Source d'exemple" }],
    tags: ["créateurs", "économie"],
  },
  {
    id: "c7",
    format: "article",
    slug: "pourquoi-la-pop-culture-camerounaise-merite-sa-critique",
    rubrique: "perspectives",
    title: "Pourquoi la pop culture camerounaise mérite sa critique",
    chapo:
      "Tribune d'exemple : sans critique culturelle locale, ce sont d'autres qui racontent nos œuvres à notre place.",
    authorSlug: "redaction",
    publishedAt: "2026-10-05T09:00:00+01:00",
    cover: exampleCover("Une salle de lecture, des magazines sur une table"),
    body: [{ type: "p", text: "Article d'exemple de la rubrique Perspectives." }],
    sources: [{ label: "Source d'exemple" }],
    tags: ["critique", "médias"],
  },
  {
    id: "c8",
    format: "article",
    slug: "series-web-format-court-public-large",
    rubrique: "ecran",
    title: "Web-séries : format court, public large",
    chapo:
      "Épisodes de dix minutes, tournages légers, diffusion sur les réseaux : la web-série est devenue un laboratoire pour les jeunes auteurs.",
    authorSlug: "auteur-exemple",
    publishedAt: "2026-10-04T09:00:00+01:00",
    cover: exampleCover("Un tournage en extérieur avec une petite équipe"),
    body: [{ type: "p", text: "Article d'exemple de la rubrique Screen." }],
    sources: [{ label: "Source d'exemple" }],
    tags: ["séries", "web"],
  },
];
