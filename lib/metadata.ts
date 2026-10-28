import type { Metadata } from "next";
import { site } from "./content";

/** Builds page metadata (title, description, canonical URL and social cards) from content. */
export function pageMetadata(meta: { title: string; description: string }, path: string, image?: string): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: path,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
      images: [{ url: image && !image.endsWith(".svg") ? image : site.ogImage }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}
