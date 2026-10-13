import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "lta_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 h : une journée de travail

function secret() {
  const s = process.env.SESSION_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET doit être défini en production.");
  }
  return "dev-only-secret-lta-le-mag";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

type Payload = { uid: string; exp: number };

export async function createSession(uid: string) {
  const payload = Buffer.from(
    JSON.stringify({ uid, exp: Date.now() + MAX_AGE * 1000 } satisfies Payload),
  ).toString("base64url");
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Renvoie l'identifiant de l'utilisateur si le cookie est intact et non expiré. */
export async function readSessionUserId(): Promise<string | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as Payload;
    return data.exp > Date.now() ? data.uid : null;
  } catch {
    return null;
  }
}
