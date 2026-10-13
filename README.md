# LTA le mag

Site public du magazine de LET'S TALK ABOUT : Next.js 16 (App Router, Cache Components), Tailwind CSS 4 et Firebase.

## Démarrer

```bash
npm install
cp .env.example .env.local   # facultatif en développement
npm run dev                  # http://localhost:3000/mag
```

Avant de livrer : `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Structure

| Dossier | Rôle |
|---|---|
| `app/mag/` | Pages : accueil, `[rubrique]`, `[rubrique]/[slug]` (article, entretien, format court), pages de service |
| `components/ui/` | Design system : boutons, étiquettes, citation, encadré, fil d'Ariane, pagination |
| `components/brand/` | Logo (variantes fond sombre et fond clair) et pictogrammes des rubriques |
| `components/layout/` | En-tête, menu, pied de page, gabarit des pages de service |
| `features/articles/` | Cartes, image de une, corps d'article, partage, lecteur vidéo, sources et corrections |
| `features/newsletter/` | Formulaire, validation Zod, action serveur (Firestore) |
| `lib/content/` | Modèle de contenu et dépôt (`use cache` + `cacheTag("contents")`) |
| `lib/rubriques.ts` | Les 6 rubriques, leurs adresses et les 3 formats |

## Design system

Les tokens sont dans `app/globals.css` (`@theme`) et suivent la mini charte graphique :

- **Couleurs** : violet `#2F2440`, bordeaux `#BF2A70` (survol `#A62957`), mauve `#A66F93`, crème `#F5D49A`, blanc.
- **Polices** : Akira Expanded pour les titres (`type-h1`, `type-h2`, `type-card-title`) et Roboto pour le reste.
- **Mise en page** : angles droits partout (aucune classe `rounded-*`), espacements en multiples de 8 px, page de 1 200 px, colonne de lecture de 720 px.

Contrastes vérifiés (WCAG) :

| Combinaison | Contraste | Usage autorisé |
|---|---|---|
| Violet sur blanc | 14,5:1 | Tout texte |
| Violet sur crème | 10,2:1 | Tout texte |
| Blanc sur bordeaux | 5,55:1 | Boutons, étiquettes |
| Bordeaux sur crème | 3,91:1 | Grands titres uniquement |
| Mauve sur blanc | 3,95:1 | Interdit pour le texte |

### Ajouter Akira Expanded (après achat de la licence web)

1. Placer le fichier `.woff2` dans `app/fonts/`.
2. Le charger dans `app/layout.tsx` avec `next/font/local`, sous la variable `--font-akira`.
3. Dans `globals.css`, remplacer `--font-display` par `var(--font-akira), Arial, sans-serif`.

En attendant, les titres s'affichent en Arial gras, la police de secours prévue par la charte.

## Contenus

`lib/content/sample-data.ts` contient des contenus **fictifs**, qui servent à remplir la base de test au premier lancement. Le site public n'affiche que les contenus au statut « Publié » (`lib/content/repository.ts`).

## Administration (mode test)

Adresse : `/admin`. En mode test, les données sont stockées dans `.data/dev-db.json` (ignoré par git). Ce fichier est créé automatiquement avec les contenus d'exemple. Pour repartir de zéro, supprimer le dossier `.data`.

| Compte | Rôle | Droits |
|---|---|---|
| redacteur@test.lta | Rédacteur | Crée et modifie ses brouillons, les envoie en relecture |
| editeur@test.lta | Éditeur | Relit, vérifie les faits, valide, publie, corrige, retire du site |
| admin@test.lta | Administrateur | Droits d'un éditeur, plus la gestion des rôles |

Mot de passe commun : `lta-test-2026`. En production, `SESSION_SECRET` est obligatoire.

Le parcours de validation suit ces étapes :

1. **Brouillon** : le rédacteur rédige.
2. **En relecture** : un éditeur relit et vérifie les faits. Il peut renvoyer le contenu au rédacteur avec des remarques.
3. **Validé** : l'éditeur coche la vérification des faits pour valider.
4. **Publié** : le site public se met à jour aussitôt (`updateTag("contents")`).

Un éditeur peut corriger un contenu publié : sa note de correction s'ajoute au journal public de l'article. L'adresse d'un contenu publié ne change plus.

Les droits sont vérifiés côté serveur dans chaque page et chaque action (`lib/auth/roles.ts`). Le fichier `proxy.ts` n'est qu'une première barrière.

Pour passer à Firebase, seuls trois modules changent :
- `lib/server/db.ts`, à remplacer par Firestore ;
- `lib/auth/session.ts` et `lib/auth/current-user.ts`, à remplacer par Firebase Auth, avec la double authentification pour les éditeurs et les administrateurs.

## À fournir ou à valider

- Logo définitif « LTA le mag ». La version actuelle est provisoire : elle est détourée du PNG LTA, avec la mention « le mag » en texte.
- Pictogrammes définitifs des 6 rubriques (`components/brand/rubrique-icon.tsx`).
- Liste des anciennes adresses du blog, à compléter dans les redirections de `next.config.ts`.
- Mentions légales : éditeur, hébergeur, e-mail de contact et outil d'analyse d'audience.
- Liens vers Facebook, LinkedIn, TikTok et YouTube (seul Instagram est connu).
