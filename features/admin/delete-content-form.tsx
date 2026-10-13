"use client";

import { deleteContent } from "./actions";

export function DeleteContentForm({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteContent}
      onSubmit={(e) => {
        if (!window.confirm(`Supprimer définitivement « ${title || "Sans titre"} » ? Cette action est irréversible.`)) {
          e.preventDefault();
        }
      }}
      className="border border-mauve p-5"
    >
      <input type="hidden" name="id" value={id} />
      <p className="type-label">Zone sensible</p>
      <button
        type="submit"
        className="mt-3 min-h-11 w-full border-2 border-bordeaux px-4 font-bold text-bordeaux hover:bg-bordeaux hover:text-blanc"
      >
        Supprimer ce contenu
      </button>
    </form>
  );
}
