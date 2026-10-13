import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Role } from "@/lib/auth/roles";
import { hashPassword } from "@/lib/auth/password";
import { CONTENTS } from "@/lib/content/sample-data";
import type { ContentRecord } from "@/lib/content/types";

/*
 * Base de données de TEST : un fichier JSON local (.data/dev-db.json).
 * Elle imite Firestore pour développer l'administration sans Firebase.
 * Ne pas utiliser en production : le fichier n'est ni partagé ni sauvegardé.
 * Pour repartir de zéro : supprimer le dossier .data.
 */

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: Role;
  authorSlug: string;
  passwordHash: string;
};

export type DbShape = { users: UserRecord[]; contents: ContentRecord[] };

const DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "dev-db.json");

export const TEST_PASSWORD = "lta-test-2026";
export const TEST_ACCOUNTS: { email: string; name: string; role: Role; authorSlug: string }[] = [
  { email: "redacteur@test.lta", name: "Rita Rédactrice (test)", role: "redacteur", authorSlug: "auteur-exemple" },
  { email: "editeur@test.lta", name: "Éric Éditeur (test)", role: "editeur", authorSlug: "redaction" },
  { email: "admin@test.lta", name: "Ada Admin (test)", role: "admin", authorSlug: "redaction" },
];

async function seed(): Promise<DbShape> {
  const users: UserRecord[] = [];
  for (const [i, a] of TEST_ACCOUNTS.entries()) {
    users.push({ id: `u${i + 1}`, ...a, passwordHash: await hashPassword(TEST_PASSWORD) });
  }
  const ownerOf = (authorSlug: string) =>
    users.find((u) => u.authorSlug === authorSlug)?.id ?? users[1].id;

  const contents: ContentRecord[] = CONTENTS.map((c) => ({
    ...c,
    status: "published",
    createdBy: ownerOf(c.authorSlug),
    createdAt: c.publishedAt,
    editedAt: c.updatedAt ?? c.publishedAt,
    history: [
      { at: c.publishedAt, userId: users[1].id, userName: users[1].name, action: "published" },
    ],
  }));

  // Deux contenus en cours, pour tester le circuit de validation.
  const now = new Date().toISOString();
  contents.push(
    {
      id: "d1",
      format: "article",
      slug: "festivals-d-ete-ce-qui-change",
      rubrique: "musique",
      title: "Festivals : ce qui change cette saison",
      chapo: "",
      authorSlug: "auteur-exemple",
      publishedAt: "",
      cover: { alt: "", credit: "" },
      body: [{ type: "p", text: "Brouillon d'exemple : texte à compléter." }],
      sources: [],
      tags: [],
      status: "draft",
      createdBy: users[0].id,
      createdAt: now,
      editedAt: now,
      history: [{ at: now, userId: users[0].id, userName: users[0].name, action: "created" }],
    },
    {
      id: "d2",
      format: "article",
      slug: "illustrateurs-qui-dessinent-la-ville",
      rubrique: "creatif",
      title: "Les illustrateurs qui dessinent la ville",
      chapo:
        "Fresques, affiches, carnets de croquis : portrait d'une génération d'illustrateurs qui fait de la ville son sujet et son support.",
      authorSlug: "auteur-exemple",
      publishedAt: "",
      cover: {
        alt: "Une fresque murale colorée dans une rue",
        credit: "Visuel d'exemple : photo à fournir par la rédaction",
      },
      body: [
        { type: "p", text: "Article d'exemple soumis à la relecture de l'éditeur." },
        { type: "h2", text: "Des murs comme galeries" },
        { type: "p", text: "Texte d'exemple." },
      ],
      sources: [{ label: "Entretiens menés par la rédaction (exemple)" }],
      tags: ["illustration", "street art"],
      status: "review",
      createdBy: users[0].id,
      createdAt: now,
      editedAt: now,
      history: [
        { at: now, userId: users[0].id, userName: users[0].name, action: "created" },
        { at: now, userId: users[0].id, userName: users[0].name, action: "submitted" },
      ],
    },
  );

  return { users, contents };
}

async function write(db: DbShape) {
  await mkdir(DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await rename(tmp, FILE);
}

export async function readDb(): Promise<DbShape> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as DbShape;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const db = await seed();
    await write(db);
    return db;
  }
}

// Les écritures sont mises en file pour éviter que deux enregistrements simultanés s'écrasent.
let queue: Promise<unknown> = Promise.resolve();

export function updateDb<T>(mutate: (db: DbShape) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await mutate(db);
    await write(db);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}
