"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RUBRIQUES } from "@/lib/rubriques";

/** Menu des rubriques : bande défilante sur mobile, ligne complète sur ordinateur. */
export function NavLinks() {
  const pathname = usePathname();
  const items = [
    ...RUBRIQUES.map((r) => ({ href: `/mag/${r.slug}`, label: r.name.replace("LTA ", "") })),
    { href: "/mag/a-propos", label: "À propos" },
  ];

  return (
    <ul className="scrollbar-none -mx-4 flex overflow-x-auto px-2 md:mx-0 md:px-0 lg:gap-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-12 items-center px-3 text-[0.9375rem] font-bold whitespace-nowrap lg:text-base ${
                active ? "text-bordeaux" : "text-violet hover:text-bordeaux"
              }`}
            >
              {item.label}
              {active ? (
                <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-1 bg-bordeaux" />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
