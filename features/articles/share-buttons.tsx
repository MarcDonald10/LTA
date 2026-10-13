import { absoluteUrl } from "@/lib/site";
import { CopyLinkButton } from "./copy-link-button";

const itemClass =
  "inline-flex min-h-11 items-center border-2 border-violet px-3 text-[0.9375rem] font-bold text-violet hover:bg-violet hover:text-blanc";

/** Partage : WhatsApp, Facebook, LinkedIn, X et copie du lien. Aucun script tiers. */
export function ShareButtons({ path, title }: { path: string; title: string }) {
  const url = absoluteUrl(path);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const networks = [
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
  ];

  return (
    <div>
      <p className="type-label">Partager</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {networks.map((n) => (
          <li key={n.label}>
            <a href={n.href} target="_blank" rel="noopener noreferrer" className={itemClass}>
              {n.label}
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </li>
        ))}
        <li>
          <CopyLinkButton url={url} className={itemClass} />
        </li>
      </ul>
    </div>
  );
}
