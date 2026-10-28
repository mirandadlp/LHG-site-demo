import Link from "next/link";
import { socialResponsibility } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageTemplate } from "@/components/sections/PageTemplate";
import { SiteImage } from "@/components/ui/SiteImage";
import { Reveal } from "@/components/ui/Reveal";

const { overview, subpages } = socialResponsibility;

export const metadata = pageMetadata(overview.meta, overview.path, overview.hero.image?.src);

export default function SocialResponsibilityPage() {
  return (
    <PageTemplate page={overview}>
      <section className="bg-forest py-20 text-ivory md:py-28">
        <div className="container-luxe">
          <ul className="grid gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
            {subpages.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.06} className="bg-forest">
                <Link href={p.path} className="group block p-6 md:p-8">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SiteImage
                      image={p.image}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
                    />
                  </div>
                  <p className="eyebrow mt-6 text-gold">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 font-serif text-3xl font-light">{p.hero.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{p.summary}</p>
                  <span className="eyebrow mt-6 inline-block text-sage group-hover:text-ivory">Read More</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </PageTemplate>
  );
}
