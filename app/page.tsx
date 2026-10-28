import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homepage, properties } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { HeroSlideshow } from "@/components/sections/HeroSlideshow";
import { PropertyCard } from "@/components/sections/PropertyCard";
import { ContactPanel } from "@/components/sections/ContactPanel";
import { SiteImage } from "@/components/ui/SiteImage";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ContentNotice } from "@/components/ui/ContentNotice";

export const metadata = pageMetadata(homepage.meta, "/");

export default function HomePage() {
  const { hero, introduction, about, services, socialResponsibility: sr, contact } = homepage;
  const featured = properties.slice(0, homepage.properties.limit);

  return (
    <>
      <HeroSlideshow hero={hero} />
      <ContentNotice status={homepage.status} />

      {/* Introduction — editorial composition with an overlapping title panel */}
      <section id="content" className="overflow-hidden py-24 md:py-36">
        <div className="container-luxe grid gap-y-12 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-8">
            <Reveal className="relative aspect-[16/11] overflow-hidden bg-mist">
              <SiteImage image={introduction.image} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
            </Reveal>
            <div className="relative -mt-16 mr-6 bg-ivory pr-6 pt-8 md:-mt-28 md:mr-24 md:pr-12 md:pt-12">
              <SectionIntro eyebrow={introduction.eyebrow} />
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-serif text-[clamp(2.2rem,4.6vw,4.4rem)] font-light uppercase leading-[0.98] tracking-[0.01em] text-forest">
                  {introduction.heading}
                </h2>
              </Reveal>
              <Reveal delay={0.2} className="prose-luxe mt-8 max-w-2xl">
                {introduction.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
              <Reveal delay={0.3} className="mt-10">
                <ArrowLink href={introduction.link.href}>{introduction.link.label}</ArrowLink>
              </Reveal>
            </div>
          </div>
          <Reveal delay={0.2} className="hidden md:col-span-4 md:block md:pt-48">
            <div className="relative aspect-[3/4] overflow-hidden bg-mist">
              <SiteImage image={introduction.secondaryImage} fill sizes="33vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our hotels */}
      <section className="border-t border-stone bg-paper py-24 md:py-32">
        <div className="container-luxe">
          <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionIntro eyebrow={homepage.properties.eyebrow} heading={homepage.properties.heading} intro={homepage.properties.intro} />
            <Reveal delay={0.1} className="shrink-0">
              <ArrowLink href={homepage.properties.link.href}>{homepage.properties.link.label}</ArrowLink>
            </Reveal>
          </div>
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.12} className={i === 1 ? "lg:mt-20" : ""}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* About — split screen */}
      <section className="grid lg:min-h-[85vh] lg:grid-cols-2">
        <div className="relative min-h-[60vw] overflow-hidden bg-forest lg:min-h-0">
          <SiteImage image={about.image} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex items-center bg-heritage px-5 py-20 text-ivory md:px-12 lg:px-20 lg:py-28">
          <div className="max-w-xl">
            <SectionIntro eyebrow={about.eyebrow} heading={about.heading} tone="light" />
            <Reveal delay={0.1} className="mt-8 space-y-5 text-base leading-relaxed text-ivory/80 md:text-[1.0625rem]">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Reveal>
            {about.highlights.length > 0 && (
              <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-ivory/20 pt-10">
                {about.highlights.map((h) => (
                  <div key={h.label}>
                    <dt className="eyebrow order-2 text-sage">{h.label}</dt>
                    <dd className="font-serif text-5xl font-light text-ivory">{h.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Reveal delay={0.2} className="mt-12">
              <ButtonLink href={about.link.href} variant="outline-light">
                {about.link.label}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Hospitality & services */}
      <section className="py-24 md:py-32">
        <div className="container-luxe">
          <div className="mb-16">
            <SectionIntro eyebrow={services.eyebrow} heading={services.heading} intro={services.intro} />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.08}>
                <Link href={item.href} className="group relative block aspect-[4/3] overflow-hidden bg-forest sm:aspect-[3/4]">
                  <SiteImage
                    image={item.image}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.07]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent transition-colors duration-700 group-hover:via-forest-deep/50"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-8">
                    <span className="eyebrow text-gold-light">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-serif text-[1.8rem] font-light leading-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/80 transition-all duration-700 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-40 lg:group-hover:opacity-100 lg:group-focus-visible:max-h-40 lg:group-focus-visible:opacity-100">
                      {item.text}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Social responsibility — framed card over full-bleed imagery */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <SiteImage image={sr.backgroundImage} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-forest/40" aria-hidden />
        <div className="container-luxe relative">
          <Reveal className="mx-auto max-w-6xl bg-ivory p-6 shadow-[0_40px_80px_-40px_rgba(0,34,26,0.6)] md:p-12 lg:p-16">
            <p className="eyebrow flex items-center gap-4 text-gold-deep">
              <span className="rule-gold" aria-hidden />
              {sr.eyebrow}
            </p>
            <h2 className="display-xl mt-6 text-forest">{sr.heading}</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
              <div className="relative aspect-[4/3] overflow-hidden bg-mist md:col-span-7">
                <SiteImage image={sr.image} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="md:col-span-5">
                <div className="prose-luxe">
                  {sr.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <ul className="mt-8 border-t border-stone">
                  {sr.links.map((l) => (
                    <li key={l.href} className="border-b border-stone">
                      <Link href={l.href} className="group flex items-center justify-between py-4 text-forest">
                        <span className="font-serif text-xl">{l.label}</span>
                        <ArrowUpRight
                          className="size-4 text-gold-deep transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactPanel eyebrow={contact.eyebrow} heading={contact.heading} intro={contact.intro} />
    </>
  );
}
