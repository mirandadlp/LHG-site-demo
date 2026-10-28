import { aboutPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageTemplate } from "@/components/sections/PageTemplate";

export const metadata = pageMetadata(aboutPage.meta, aboutPage.path, aboutPage.hero.image?.src);

export default function AboutPage() {
  return <PageTemplate page={aboutPage} />;
}
