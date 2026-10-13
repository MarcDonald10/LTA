import type { MetadataRoute } from "next";
import { getAllContentPaths } from "@/lib/content/repository";
import { RUBRIQUES } from "@/lib/rubriques";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contents = await getAllContentPaths();

  return [
    { url: absoluteUrl("/mag"), changeFrequency: "daily", priority: 1 },
    ...RUBRIQUES.map((r) => ({
      url: absoluteUrl(`/mag/${r.slug}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...contents.map((c) => ({
      url: absoluteUrl(`/mag/${c.rubrique}/${c.slug}`),
      lastModified: c.updatedAt,
      priority: 0.7,
    })),
    ...["a-propos", "charte-editoriale", "mentions-legales"].map((p) => ({
      url: absoluteUrl(`/mag/${p}`),
      priority: 0.3,
    })),
  ];
}
