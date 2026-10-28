import { notFound } from "next/navigation";
import { catchAllPages, getCatchAllPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageTemplate } from "@/components/sections/PageTemplate";

/** Serves every page defined in content/pages.json and content/legal.json. */
export function generateStaticParams() {
  return catchAllPages.map((p) => ({ slug: p.path.split("/").filter(Boolean) }));
}

const toPath = (slug: string[]) => "/" + slug.map(decodeURIComponent).join("/");

export async function generateMetadata({ params }: PageProps<"/[...slug]">) {
  const page = getCatchAllPage(toPath((await params).slug));
  return page ? pageMetadata(page.meta, page.path, page.hero.image?.src) : {};
}

export default async function ContentPage({ params }: PageProps<"/[...slug]">) {
  const page = getCatchAllPage(toPath((await params).slug));
  if (!page) notFound();
  return <PageTemplate page={page} />;
}
