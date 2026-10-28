import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Property } from "@/lib/schema";
import { SiteImage } from "@/components/ui/SiteImage";

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <SiteImage
          image={property.image}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/50 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-90" aria-hidden />
      </div>
      <div className="pt-6">
        <p className="eyebrow text-gold-deep">{property.location}</p>
        <h3 className="mt-3 font-serif text-[1.9rem] font-light leading-tight text-forest">
          <Link href={`/hotels/${property.slug}`} className="after:absolute after:inset-0">
            {property.name}
          </Link>
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{property.summary}</p>
        <span className="mt-5 inline-flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-heritage" aria-hidden>
          <span className="link-draw pb-1 group-hover:bg-[length:100%_1px]">View Property</span>
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.25} />
        </span>
      </div>
    </article>
  );
}
