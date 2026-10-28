import Link from "next/link";
import type { Page } from "@/lib/schema";
import { SiteImage } from "@/components/ui/SiteImage";

export type Crumb = { label: string; href: string };

const fallbackImage = { src: "/images/placeholders/detail.svg", alt: "" };

/** Shorter hero used at the top of every inner page. */
export function PageHero({ hero, crumbs = [] }: { hero: Page["hero"]; crumbs?: Crumb[] }) {
  const image = hero.image ?? fallbackImage;
  return (
    <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-forest md:min-h-[78svh]">
      <SiteImage image={image} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/45 to-black/35" aria-hidden />
      <div className="container-luxe relative pb-14 pt-36 md:pb-20">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/70">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-ivory">
                      {c.label}
                    </span>
                  ) : (
                    <Link href={c.href} className="hover:text-ivory">
                      {c.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {hero.eyebrow && (
          <p className="eyebrow flex items-center gap-4 text-ivory/85">
            <span className="rule-gold" aria-hidden />
            {hero.eyebrow}
          </p>
        )}
        <h1 className="display-xl mt-5 max-w-5xl text-ivory">{hero.title}</h1>
        {hero.intro && <p className="mt-7 max-w-2xl text-base leading-relaxed text-ivory/80 md:text-lg">{hero.intro}</p>}
      </div>
    </section>
  );
}
