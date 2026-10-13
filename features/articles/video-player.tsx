"use client";

import { useState } from "react";
import type { VideoEmbed } from "@/lib/content/types";

/**
 * Vidéo YouTube chargée uniquement au clic : aucune lecture automatique,
 * aucun script tiers tant que le lecteur n'a pas choisi de regarder.
 */
export function VideoPlayer({ video }: { video: VideoEmbed }) {
  const [active, setActive] = useState(false);
  const aspect = video.vertical ? "aspect-[9/16] max-w-sm" : "aspect-video";

  if (!video.id) {
    return (
      <div className={`${aspect} flex w-full items-center justify-center bg-violet px-6 text-center text-creme`}>
        <p>La vidéo sera disponible prochainement.</p>
      </div>
    );
  }

  if (active) {
    return (
      <div className={`${aspect} w-full bg-violet`}>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className={`${aspect} group on-dark flex w-full flex-col items-center justify-center gap-4 bg-violet text-creme`}
    >
      <span className="flex h-16 w-16 items-center justify-center bg-bordeaux group-hover:bg-bordeaux-fonce">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7L8 5Z" fill="#fff" />
        </svg>
      </span>
      <span className="font-bold">Lire la vidéo : {video.title}</span>
      <span className="type-caption">Lecture sur YouTube, chargée à la demande</span>
    </button>
  );
}
