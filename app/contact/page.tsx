import { contact } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageTemplate } from "@/components/sections/PageTemplate";
import { ContactPanel } from "@/components/sections/ContactPanel";

const { page } = contact;

export const metadata = pageMetadata(page.meta, page.path, page.hero.image?.src);

export default function ContactPage() {
  return (
    <PageTemplate page={page}>
      <ContactPanel />
    </PageTemplate>
  );
}
