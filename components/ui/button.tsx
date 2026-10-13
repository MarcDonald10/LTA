import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "secondary-on-dark";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 px-5 text-[0.9375rem] font-bold leading-5 transition-colors lg:text-base disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Rectangle plein bordeaux, texte blanc ; bordeaux plus foncé au survol
  primary: "bg-bordeaux text-blanc hover:bg-bordeaux-fonce",
  // Contour violet 2 px, texte violet, fond transparent
  secondary: "border-2 border-violet text-violet hover:bg-violet hover:text-blanc",
  "secondary-on-dark": "border-2 border-creme text-creme hover:bg-creme hover:text-violet",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
