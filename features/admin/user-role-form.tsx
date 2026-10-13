"use client";

import { useActionState } from "react";
import { ROLES, type Role } from "@/lib/auth/roles";
import { updateUserRole, type RoleState } from "./actions";

export function UserRoleForm({ userId, role, name }: { userId: string; role: Role; name: string }) {
  const [state, action, pending] = useActionState<RoleState, FormData>(updateUserRole, { status: "idle" });
  const id = `role-${userId}`;

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <label htmlFor={id} className="sr-only">
        Rôle de {name}
      </label>
      <select id={id} name="role" defaultValue={role} className="min-h-11 border-2 border-violet bg-blanc px-3 text-base">
        {(Object.keys(ROLES) as Role[]).map((r) => (
          <option key={r} value={r}>
            {ROLES[r].label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 border-2 border-violet px-4 font-bold hover:bg-violet hover:text-blanc disabled:opacity-60"
      >
        {pending ? "…" : "Changer"}
      </button>
      {state.message ? (
        <p role={state.status === "error" ? "alert" : "status"} className={`w-full text-[0.9375rem] ${state.status === "error" ? "font-medium text-bordeaux" : ""}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
