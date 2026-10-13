import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { listUsers } from "@/features/admin/queries";
import { AccessDenied, AdminPageSkeleton } from "@/features/admin/ui";
import { UserRoleForm } from "@/features/admin/user-role-form";
import { requireUser } from "@/lib/auth/current-user";
import { ROLES, can } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Utilisateurs" };

export default function UsersPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <Users />
    </Suspense>
  );
}

const ROLE_HELP = [
  { role: "redacteur", text: "Crée et modifie ses contenus tant qu'ils sont en brouillon, puis les envoie en relecture." },
  { role: "editeur", text: "Relit, vérifie les faits, valide, publie et corrige tous les contenus." },
  { role: "admin", text: "Droits d'un éditeur, plus la gestion des utilisateurs." },
] as const;

async function Users() {
  const user = await requireUser();
  if (!can.manageUsers(user)) {
    return <AccessDenied message="La gestion des utilisateurs est réservée aux administrateurs." />;
  }
  const users = await listUsers();

  return (
    <Container className="py-8">
      <h1 className="type-h1">Utilisateurs</h1>
      <p className="mt-1">Les comptes de la rédaction et leurs droits.</p>

      <ul className="mt-8 divide-y divide-mauve border-y border-mauve">
        {users.map((u) => (
          <li key={u.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold">
                {u.name}
                {u.id === user.id ? <span className="type-caption ml-2 font-normal">(vous)</span> : null}
              </p>
              <p className="type-caption">{u.email}</p>
            </div>
            {u.id === user.id ? (
              <p className="font-bold">{ROLES[u.role].label}</p>
            ) : (
              <UserRoleForm userId={u.id} role={u.role} name={u.name} />
            )}
          </li>
        ))}
      </ul>

      <section aria-labelledby="roles" className="mt-10 max-w-read bg-creme p-6">
        <h2 id="roles" className="type-h3">
          Qui peut faire quoi ?
        </h2>
        <dl className="mt-3 space-y-3">
          {ROLE_HELP.map((r) => (
            <div key={r.role}>
              <dt className="font-bold">{ROLES[r.role].label}</dt>
              <dd>{r.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[0.9375rem]">
          L&apos;invitation de nouveaux membres et la double authentification arrivent avec Firebase Auth.
        </p>
      </section>
    </Container>
  );
}
