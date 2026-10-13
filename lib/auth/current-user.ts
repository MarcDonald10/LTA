import "server-only";
import { redirect } from "next/navigation";
import { readDb } from "@/lib/server/db";
import type { SessionUser } from "./roles";
import { readSessionUserId } from "./session";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const uid = await readSessionUserId();
  if (!uid) return null;
  const user = (await readDb()).users.find((u) => u.id === uid);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, authorSlug: user.authorSlug };
}

/** Pour les pages : renvoie vers la connexion si la session est absente ou expirée. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/connexion");
  return user;
}
