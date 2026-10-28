import { properties, propertiesContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageTemplate } from "@/components/sections/PageTemplate";
import { PropertyCard } from "@/components/sections/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";

const { page } = propertiesContent;

export const metadata = pageMetadata(page.meta, page.path, page.hero.image?.src);

export default function HotelsPage() {
  return (
    <PageTemplate page={page}>
      <section className="py-20 md:py-28">
        <div className="container-luxe">
          <p className="eyebrow mb-12 text-gold-deep">
            {properties.length} {properties.length === 1 ? "hotel" : "hotels"}
          </p>
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 0.1} className={i % 3 === 1 ? "lg:mt-20" : ""}>
                <PropertyCard property={p} priority={i < 3} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </PageTemplate>
  );
}
