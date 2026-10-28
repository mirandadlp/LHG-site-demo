"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Image } from "@/lib/schema";
import { SiteImage } from "@/components/ui/SiteImage";

/** Responsive image grid with an accessible full-screen viewer. */
export function Gallery({ images }: { images: Image[] }) {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setActive((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [active, close, step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:auto-rows-[15rem] md:grid-cols-3 md:gap-4 lg:auto-rows-[18rem]">
        {images.map((image, i) => (
          <li
            key={image.src + i}
            className={i % 5 === 0 ? "col-span-2 md:row-span-2" : "col-span-1"}
          >
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setActive(i);
              }}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-mist md:aspect-auto md:h-full"
            >
              <SiteImage
                image={image}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
              />
              <span className="sr-only">Open image {i + 1} of {images.length}</span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${active + 1} of ${images.length}`}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-forest-deep/95 p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="relative h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <SiteImage image={images[active]} fill sizes="100vw" className="object-contain" />
            </div>
            <button ref={closeRef} type="button" onClick={close} className="absolute right-4 top-4 p-3 text-ivory md:right-8 md:top-8" aria-label="Close gallery">
              <X className="size-6" strokeWidth={1} aria-hidden />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-ivory md:left-6" aria-label="Previous image">
                  <ChevronLeft className="size-8" strokeWidth={1} aria-hidden />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-ivory md:right-6" aria-label="Next image">
                  <ChevronRight className="size-8" strokeWidth={1} aria-hidden />
                </button>
              </>
            )}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-ivory/70">
              {active + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
