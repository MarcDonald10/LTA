import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ROLES, can } from "@/lib/auth/roles";
import { logout } from "./actions";

/** En-tête de l'administration : la partie liée à la session arrive en streaming. */
export function AdminHeader() {
  return (
    <header className="on-dark bg-violet text-blanc">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <Link href="/admin" className="font-bold">
          <span className="font-display uppercase">LTA le mag</span>
          <span className="ml-2 text-creme">· Administration</span>
        </Link>
        <Suspense fallback={<div className="h-11 w-48 animate-pulse bg-blanc/10" aria-hidden="true" />}>
          <SessionArea />
        </Suspense>
      </Container>
    </header>
  );
}

async function SessionArea() {
  const user = await getCurrentUser();
  if (!user) return null;
  const link = "inline-flex min-h-11 items-center px-2 font-bold text-blanc hover:text-creme";

  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <nav aria-label="Administration" className="flex flex-wrap items-center">
        <Link href="/admin" className={link}>
          Contenus
        </Link>
        {can.manageUsers(user) ? (
          <Link href="/admin/utilisateurs" className={link}>
            Utilisateurs
          </Link>
        ) : null}
        <Link href="/mag" className={link} target="_blank" rel="noopener">
          Voir le site <span className="sr-only">(nouvel onglet)</span>
        </Link>
      </nav>
      <span className="hidden h-6 w-px bg-mauve sm:block" aria-hidden="true" />
      <p className="px-2 text-[0.9375rem]">
        {user.name} <span className="text-creme">· {ROLES[user.role].label}</span>
      </p>
      <form action={logout}>
        <button type="submit" className="min-h-11 border-2 border-creme px-3 text-[0.9375rem] font-bold text-creme hover:bg-creme hover:text-violet">
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
