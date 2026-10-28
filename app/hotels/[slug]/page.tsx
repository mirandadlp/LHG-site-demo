import { notFound } from "next/navigation";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { breadcrumbsFor, getProperty, properties } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/PageHero";
import { Gallery } from "@/components/sections/Gallery";
import { PropertyCard } from "@/components/sections/PropertyCard";
import { ContentNotice } from "@/components/ui/ContentNotice";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/hotels/[slug]">) {
  const property = getProperty((await params).slug);
  return property ? pageMetadata(property.meta, `/hotels/${property.slug}`, property.image.src) : {};
}

export default async function PropertyPage({ params }: PageProps<"/hotels/[slug]">) {
  const property = getProperty((await params).slug);
  if (!property) notFound();

  const path = `/hotels/${property.slug}`;
  const others = properties.filter((p) => p.slug !== property.slug).slice(0, 3);
  const { details } = property;
  const contactRows = [
    { icon: MapPin, label: "Address", value: details.address },
    { icon: Phone, label: "Telephone", value: details.phone },
    { icon: Mail, label: "Email", value: details.email },
  ].filter((r) => r.value);

  return (
    <>
      <PageHero
        hero={{ eyebrow: property.location, title: property.name, intro: property.summary, image: property.image }}
        crumbs={breadcrumbsFor(path)}
      />
      <ContentNotice status={property.status} />

      <div id="content">
        <section className="py-20 md:py-28">
          <div className="container-luxe grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionIntro eyebrow="Overview" heading={`Welcome to ${property.name}`} />
              <Reveal delay={0.1} className="prose-luxe mt-8">
                {property.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
            </div>
            <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
              <aside className="border border-stone bg-paper p-8 md:p-10" aria-label="Hotel details">
                <h2 className="font-serif text-2xl text-forest">At a Glance</h2>
                <dl className="mt-8 space-y-5">
                  {contactRows.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-4">
                      <Icon className="mt-0.5 size-4 shrink-0 text-gold-deep" strokeWidth={1.25} aria-hidden />
                      <div>
                        <dt className="eyebrow text-muted">{label}</dt>
                        <dd className="mt-1 text-sm text-charcoal">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className="mt-10 flex flex-col gap-3">
                  {details.bookingUrl ? (
                    <a href={details.bookingUrl} target="_blank" rel="noopener noreferrer" className="eyebrow inline-flex min-h-12 items-center justify-center gap-2 bg-heritage px-6 text-ivory hover:bg-forest">
                      Book Now <ExternalLink className="size-3.5" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : null}
                  <ButtonLink href="/contact" variant={details.bookingUrl ? "outline-dark" : "solid"}>
                    Make an Enquiry
                  </ButtonLink>
                  {details.website ? (
                    <a href={details.website} target="_blank" rel="noopener noreferrer" className="eyebrow mt-2 text-center text-heritage underline underline-offset-4">
                      Visit hotel website <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </aside>
            </Reveal>
          </div>
        </section>

        {property.highlights.length > 0 && (
          <section className="bg-sage-light/60 py-20 md:py-28">
            <div className="container-luxe grid gap-12 md:grid-cols-12">
              <div className="md:col-span-5">
                <SectionIntro eyebrow="Highlights" heading="The Hotel" />
              </div>
              <ul className="grid gap-x-10 sm:grid-cols-2 md:col-span-7">
                {property.highlights.map((h, i) => (
                  <Reveal as="li" key={h + i} delay={i * 0.05} className="border-t border-forest/15 py-5 font-serif text-xl text-forest">
                    {h}
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}

        {property.gallery.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="container-luxe">
              <div className="mb-12">
                <SectionIntro eyebrow="Gallery" heading="Inside the Hotel" />
              </div>
              <Gallery images={property.gallery} />
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="border-t border-stone bg-paper py-20 md:py-28">
            <div className="container-luxe">
              <div className="mb-14">
                <SectionIntro eyebrow="The Collection" heading="Other Hotels" />
              </div>
              <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((p, i) => (
                  <Reveal as="li" key={p.slug} delay={i * 0.1}>
                    <PropertyCard property={p} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
