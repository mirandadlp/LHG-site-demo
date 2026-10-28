import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Section } from "@/lib/schema";
import { properties } from "@/lib/content";
import { SiteImage } from "@/components/ui/SiteImage";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { PropertyCard } from "./PropertyCard";
import { Gallery } from "./Gallery";

/**
 * Renders the "sections" array of any page in /content. Each section type
 * maps to one layout below; see CONTENT-GUIDE.md for the available types.
 */
export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} />
      ))}
    </>
  );
}

function SectionBlock({ section }: { section: Section }) {
  switch (section.type) {
    case "text":
      return (
        <section id={section.id} className="py-20 md:py-28">
          <div className="container-luxe">
            <div className={section.align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
              <SectionIntro eyebrow={section.eyebrow} heading={section.heading} align={section.align} />
              <Reveal delay={0.1} className="prose-luxe mt-8">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      );

    case "split":
      return (
        <section id={section.id} className="py-16 md:py-24">
          <div className="container-luxe grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className={`relative md:col-span-7 ${section.reverse ? "md:order-2" : ""}`}>
              <div
                className={`absolute -bottom-4 hidden h-full w-full border border-gold/50 md:block ${section.reverse ? "-left-4" : "-right-4"}`}
                aria-hidden
              />
              <div className="relative aspect-[5/4] overflow-hidden bg-mist">
                <SiteImage image={section.image} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
            <div className="md:col-span-5">
              <SectionIntro eyebrow={section.eyebrow} heading={section.heading} />
              <Reveal delay={0.1} className="prose-luxe mt-7">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
              {section.link && (
                <Reveal delay={0.2} className="mt-9">
                  <ArrowLink href={section.link.href}>{section.link.label}</ArrowLink>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      );

    case "cards": {
      const hasImages = section.items.some((i) => i.image);
      return (
        <section id={section.id} className="py-20 md:py-28">
          <div className="container-luxe">
            {(section.heading || section.eyebrow) && (
              <div className="mb-14">
                <SectionIntro eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
              </div>
            )}
            <ul className={`grid gap-x-8 gap-y-14 sm:grid-cols-2 ${section.items.length >= 3 ? "lg:grid-cols-3" : ""}`}>
              {section.items.map((item, i) => (
                <Reveal as="li" key={item.title + i} delay={i * 0.08} className="group relative">
                  {item.image ? (
                    <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-mist">
                      <SiteImage
                        image={item.image}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    !hasImages && <span className="rule-gold mb-6" aria-hidden />
                  )}
                  <h3 className="font-serif text-[1.7rem] font-light leading-tight text-forest">
                    {item.href ? (
                      <Link href={item.href} className="after:absolute after:inset-0">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
                  {item.href && (
                    <span className="mt-5 inline-block text-[0.72rem] font-medium uppercase tracking-[0.2em] text-heritage" aria-hidden>
                      <span className="link-draw pb-1 group-hover:bg-[length:100%_1px]">{item.linkLabel ?? "Discover"}</span>
                    </span>
                  )}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    case "list":
      return (
        <section id={section.id} className="bg-sage-light/60 py-20 md:py-28">
          <div className="container-luxe grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionIntro eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
            </div>
            <ul className="md:col-span-6 md:col-start-7">
              {section.items.map((item, i) => (
                <Reveal as="li" key={item + i} delay={i * 0.06} className="flex items-baseline gap-6 border-t border-forest/15 py-5 last:border-b">
                  <span className="text-[0.7rem] tracking-[0.2em] text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-xl text-forest md:text-2xl">{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section id={section.id} className="py-20 md:py-28">
          <div className="container-luxe">
            {(section.heading || section.eyebrow) && (
              <div className="mb-12">
                <SectionIntro eyebrow={section.eyebrow} heading={section.heading} />
              </div>
            )}
            <Gallery images={section.images} />
          </div>
        </section>
      );

    case "links":
      return (
        <section id={section.id} className="py-20 md:py-28">
          <div className="container-luxe">
            {(section.heading || section.eyebrow) && (
              <div className="mb-12">
                <SectionIntro eyebrow={section.eyebrow} heading={section.heading} />
              </div>
            )}
            <ul className="grid border-t border-stone md:grid-cols-2">
              {section.items.map((item, i) => (
                <Reveal as="li" key={item.href} delay={i * 0.06} className="border-b border-stone md:odd:border-r md:odd:pr-10 md:even:pl-10">
                  <Link href={item.href} className="group flex items-start justify-between gap-6 py-8">
                    <span>
                      <span className="block font-serif text-3xl font-light text-forest transition-colors group-hover:text-heritage">
                        {item.label}
                      </span>
                      {item.description && <span className="mt-2 block text-sm text-muted">{item.description}</span>}
                    </span>
                    <ArrowUpRight
                      className="mt-2 size-5 shrink-0 text-gold-deep transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      );

    case "cta": {
      const green = section.tone !== "ivory";
      return (
        <section id={section.id} className={green ? "bg-heritage text-ivory" : "bg-mist text-forest"}>
          <div className="container-luxe flex flex-col items-start gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-24">
            <Reveal className="max-w-2xl">
              <h2 className={`display-lg ${green ? "text-ivory" : "text-forest"}`}>{section.heading}</h2>
              {section.text && <p className={`mt-5 text-base leading-relaxed ${green ? "text-ivory/75" : "text-muted"}`}>{section.text}</p>}
            </Reveal>
            <Reveal delay={0.15}>
              <ButtonLink href={section.link.href} variant={green ? "ivory" : "solid"}>
                {section.link.label}
              </ButtonLink>
            </Reveal>
          </div>
        </section>
      );
    }

    case "properties": {
      const list = section.limit ? properties.slice(0, section.limit) : properties;
      return (
        <section id={section.id} className="py-20 md:py-28">
          <div className="container-luxe">
            {(section.heading || section.eyebrow) && (
              <div className="mb-14">
                <SectionIntro eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
              </div>
            )}
            <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={(i % 3) * 0.1}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    case "legal":
      return (
        <section id={section.id} className="py-20 md:py-28">
          <article className="container-luxe max-w-3xl">
            {section.lastUpdated && <p className="eyebrow text-gold-deep">Last updated: {section.lastUpdated}</p>}
            {section.clauses.map((clause, i) => (
              <div key={clause.heading + i} className="mt-12 first:mt-8">
                <h2 className="font-serif text-3xl text-forest">{clause.heading}</h2>
                <div className="prose-luxe mt-4">
                  {clause.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </article>
        </section>
      );
  }
}
