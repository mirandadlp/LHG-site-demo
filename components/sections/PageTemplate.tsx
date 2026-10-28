import type { Page } from "@/lib/schema";
import { breadcrumbsFor } from "@/lib/content";
import { ContentNotice } from "@/components/ui/ContentNotice";
import { PageHero } from "./PageHero";
import { SectionRenderer } from "./SectionRenderer";

/** Standard inner page: hero, optional draft notice, any page-specific children, then the content sections. */
export function PageTemplate({ page, children }: { page: Page; children?: React.ReactNode }) {
  return (
    <>
      <PageHero hero={page.hero} crumbs={breadcrumbsFor(page.path)} />
      <ContentNotice status={page.status} />
      <div id="content">
        {children}
        <SectionRenderer sections={page.sections} />
      </div>
    </>
  );
}
