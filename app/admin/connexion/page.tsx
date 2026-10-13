import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ROLES } from "@/lib/auth/roles";
import { LoginForm } from "@/features/admin/login-form";
import { TEST_ACCOUNTS, TEST_PASSWORD } from "@/lib/server/db";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <div className="on-dark bg-violet px-4 py-8 md:flex md:w-2/5 md:flex-col md:justify-between md:px-10 md:py-12">
        <Logo variant="dark" width={170} />
        <p className="mt-6 max-w-xs text-creme md:mt-0">
          Espace de la rédaction : rédiger, relire, valider et publier les contenus du magazine.
        </p>
      </div>

      <div className="flex flex-1 items-start justify-center px-4 py-10 md:items-center md:px-10">
        <div className="w-full max-w-md">
          <h1 className="type-h1">Connexion</h1>
          <p className="mt-2 mb-8">Accès réservé à la rédaction de LTA le mag.</p>
          <LoginForm />

          <aside className="mt-10 border-2 border-violet p-5" aria-labelledby="comptes-test">
            <h2 id="comptes-test" className="type-label">
              Mode test : comptes disponibles
            </h2>
            <ul className="mt-3 space-y-2 text-[0.9375rem]">
              {TEST_ACCOUNTS.map((a) => (
                <li key={a.email}>
                  <span className="font-bold">{ROLES[a.role].label}</span> : {a.email}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.9375rem]">
              Mot de passe commun : <code className="bg-creme px-1 font-bold">{TEST_PASSWORD}</code>
            </p>
          </aside>

          <p className="mt-8 text-[0.9375rem]">
            <Link href="/mag" className="link">
              Retour au magazine
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
