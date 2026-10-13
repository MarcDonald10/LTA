import type { Block, Source } from "./types";

/*
 * Syntaxe du corps d'article dans l'administration (blocs séparés par une ligne vide) :
 *   ## Intertitre
 *   ### Sous-titre
 *   > Citation mise en valeur
 *   > — Auteur de la citation          (ligne facultative)
 *   !! À retenir                       (titre de l'encadré)
 *   - premier point
 *   - deuxième point
 *   Tout autre bloc est un paragraphe.
 */

export function parseBody(text: string): Block[] {
  const chunks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks.map((chunk): Block => {
    const lines = chunk.split("\n").map((l) => l.trim());
    const first = lines[0];

    if (first.startsWith("### ")) return { type: "h3", text: first.slice(4).trim() };
    if (first.startsWith("## ")) return { type: "h2", text: first.slice(3).trim() };

    if (first.startsWith(">")) {
      const quoteLines = lines.map((l) => l.replace(/^>\s?/, ""));
      const last = quoteLines[quoteLines.length - 1];
      const hasCite = quoteLines.length > 1 && /^[—–-]\s/.test(last);
      return {
        type: "quote",
        text: (hasCite ? quoteLines.slice(0, -1) : quoteLines).join(" ").trim(),
        cite: hasCite ? last.replace(/^[—–-]\s/, "").trim() : undefined,
      };
    }

    if (first.startsWith("!!")) {
      return {
        type: "keypoints",
        title: first.slice(2).trim() || "À retenir",
        items: lines
          .slice(1)
          .map((l) => l.replace(/^[-•]\s?/, "").trim())
          .filter(Boolean),
      };
    }

    return { type: "p", text: lines.join(" ") };
  });
}

export function serializeBody(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "p":
          return b.text;
        case "h2":
          return `## ${b.text}`;
        case "h3":
          return `### ${b.text}`;
        case "quote":
          return `> ${b.text}${b.cite ? `\n> — ${b.cite}` : ""}`;
        case "keypoints":
          return [`!! ${b.title}`, ...b.items.map((i) => `- ${i}`)].join("\n");
        case "image":
          return ""; // géré par la médiathèque (étape suivante)
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

/** Une source par ligne : « Libellé | https://adresse » (adresse facultative). */
export function parseSources(text: string): Source[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((s) => s.trim());
      return url ? { label, url } : { label };
    });
}

export function serializeSources(sources: Source[]): string {
  return sources.map((s) => (s.url ? `${s.label} | ${s.url}` : s.label)).join("\n");
}

export function parseList(text: string, separator: RegExp = /\n/): string[] {
  return text
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’«»"]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
