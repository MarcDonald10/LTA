"use client";

import { useState } from "react";

export function CopyLinkButton({ url, className }: { url: string; className: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <button type="button" onClick={copy} className={className}>
      <span aria-live="polite">
        {status === "copied" ? "Lien copié" : status === "error" ? "Copie impossible" : "Copier le lien"}
      </span>
    </button>
  );
}
