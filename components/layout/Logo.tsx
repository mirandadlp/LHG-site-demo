import Image from "next/image";
import type { Site } from "@/lib/schema";

/**
 * Renders the LHG logo from content/site.json ("logo.src" for light backgrounds,
 * "logo.srcOnDark" for dark backgrounds). Until the official logo files are added,
 * a typographic placeholder is shown in the current text colour.
 */
export function Logo({
  logo,
  onDark = false,
  className = "",
}: {
  logo: Site["logo"];
  onDark?: boolean;
  className?: string;
}) {
  const src = onDark ? logo.srcOnDark || logo.src : logo.src;
  if (src) {
    return (
      <Image
        src={src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority
        unoptimized={src.endsWith(".svg")}
        className={`h-auto w-auto max-h-12 ${className}`}
      />
    );
  }
  return (
    <span className={`flex flex-col items-center leading-none ${className}`} title="Placeholder logo — add the official LHG logo in content/site.json">
      <span className="font-serif text-[1.8rem] font-light tracking-[0.18em] sm:text-[2rem] md:text-[2.4rem]" aria-hidden>
        LHG
      </span>
      <span className="mt-1 hidden text-[0.52rem] font-medium tracking-[0.42em] uppercase opacity-90 sm:block" aria-hidden>
        London Hotel Group
      </span>
      <span className="sr-only">{logo.alt}</span>
    </span>
  );
}
