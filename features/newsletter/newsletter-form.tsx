"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { subscribeToNewsletter } from "./actions";
import type { NewsletterState } from "./schema";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeToNewsletter, initialState);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <p role="status" className="border-l-4 border-creme pl-4 text-lg font-medium text-blanc">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} noValidate className="max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Adresse e-mail
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="votre@email.cm"
            defaultValue={state.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "newsletter-email-error" : undefined}
            className="min-h-11 w-full border-2 border-creme bg-blanc px-4 text-base text-violet placeholder:text-violet/70"
          />
        </div>
        <button type="submit" disabled={pending} className={buttonClasses("primary", "sm:w-auto")}>
          {pending ? "Inscription…" : "S'inscrire"}
        </button>
      </div>
      {errors.email ? (
        <p id="newsletter-email-error" className="mt-2 font-medium text-creme">
          {errors.email}
        </p>
      ) : null}

      <div className="mt-4 flex gap-3">
        <input
          id="newsletter-consent"
          name="consent"
          type="checkbox"
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "newsletter-consent-error" : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-bordeaux"
        />
        <label htmlFor="newsletter-consent" className="text-[0.9375rem] leading-6 text-blanc">
          J&apos;accepte de recevoir la newsletter de LTA le mag. Désinscription possible à tout
          moment ; voir notre{" "}
          <Link href="/mag/mentions-legales#confidentialite" className="text-creme underline">
            politique de confidentialité
          </Link>
          .
        </label>
      </div>
      {errors.consent ? (
        <p id="newsletter-consent-error" className="mt-2 font-medium text-creme">
          {errors.consent}
        </p>
      ) : null}

      {state.status === "error" && state.message ? (
        <p role="alert" className="mt-4 font-medium text-creme">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
