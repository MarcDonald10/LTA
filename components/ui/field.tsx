import type { ComponentProps, ReactNode } from "react";

const control =
  "w-full border-2 border-violet bg-blanc px-3 text-base text-violet placeholder:text-violet/60 disabled:cursor-not-allowed disabled:border-violet/30 disabled:bg-violet/5 aria-[invalid=true]:border-bordeaux";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

/** Libellé, aide et message d'erreur reliés au champ (aria-describedby). */
export function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label}
        {required ? <span className="text-bordeaux"> *</span> : null}
      </label>
      {hint ? (
        <div id={`${id}-hint`} className="type-caption mt-1">
          {hint}
        </div>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[0.9375rem] font-medium text-bordeaux">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

type Common = { name: string; label: string; hint?: ReactNode; error?: string; required?: boolean };

export function TextField({
  name,
  label,
  hint,
  error,
  required,
  id = `f-${name}`,
  className = "",
  ...props
}: Common & Omit<ComponentProps<"input">, "name">) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} min-h-11 ${className}`}
        {...props}
      />
    </FieldShell>
  );
}

export function TextArea({
  name,
  label,
  hint,
  error,
  required,
  id = `f-${name}`,
  className = "",
  ...props
}: Common & Omit<ComponentProps<"textarea">, "name">) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} py-2 leading-7 ${className}`}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  hint,
  error,
  required,
  id = `f-${name}`,
  options,
  ...props
}: Common & Omit<ComponentProps<"select">, "name"> & { options: { value: string; label: string }[] }) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} min-h-11`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Message de retour (succès / erreur) annoncé aux lecteurs d'écran. */
export function FormMessage({ status, children }: { status: "success" | "error"; children: ReactNode }) {
  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={`border-l-4 px-4 py-3 font-medium ${
        status === "error" ? "border-bordeaux bg-bordeaux/10" : "border-violet bg-creme"
      }`}
    >
      {children}
    </p>
  );
}
