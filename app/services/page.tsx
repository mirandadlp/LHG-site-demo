import { servicesContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageTemplate } from "@/components/sections/PageTemplate";
import { SiteImage } from "@/components/ui/SiteImage";
import { Reveal } from "@/components/ui/Reveal";

const { page, services } = servicesContent;

export const metadata = pageMetadata(page.meta, page.path, page.hero.image?.src);

export default function ServicesPage() {
  return (
    <PageTemplate page={page}>
      <div className="py-12 md:py-20">
        {services.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28 py-12 md:py-16">
            <div className="container-luxe grid items-center gap-10 md:grid-cols-12 md:gap-16">
              <Reveal className={`relative aspect-[5/4] overflow-hidden bg-mist md:col-span-6 ${i % 2 ? "md:order-2" : ""}`}>
                <SiteImage image={s.image} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </Reveal>
              <Reveal delay={0.1} className="md:col-span-5">
                <p className="eyebrow text-gold-deep">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${s.id}-title`} className="display-md mt-4 text-forest">
                  {s.title}
                </h2>
                <p className="mt-5 font-serif text-xl italic text-heritage">{s.summary}</p>
                <div className="prose-luxe mt-6">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>
    </PageTemplate>
  );
}
