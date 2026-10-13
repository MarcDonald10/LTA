"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage, TextField } from "@/components/ui/field";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.error ? <FormMessage status="error">{state.error}</FormMessage> : null}
      <TextField
        name="email"
        label="E-mail"
        type="email"
        autoComplete="username"
        inputMode="email"
        required
        defaultValue={state.email}
      />
      <TextField name="password" label="Mot de passe" type="password" autoComplete="current-password" required />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
