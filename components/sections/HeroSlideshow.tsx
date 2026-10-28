"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import type { Homepage } from "@/lib/schema";
import { SiteImage } from "@/components/ui/SiteImage";
import { ButtonLink } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSlideshow({ hero }: { hero: Homepage["hero"] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const multiple = hero.slides.length > 1;
  const playing = multiple && !paused && !reduceMotion;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % hero.slides.length),
      hero.slideIntervalSeconds * 1000
    );
    return () => window.clearTimeout(id);
  }, [playing, index, hero.slides.length, hero.slideIntervalSeconds]);

  return (
    <section aria-roledescription="carousel" aria-label="Introduction" className="relative h-[100svh] min-h-[38rem] overflow-hidden bg-forest">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease }}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${hero.slides.length}`}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduceMotion ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: hero.slideIntervalSeconds + 2, ease: "linear" }}
          >
            <SiteImage image={hero.slides[index]} fill priority={index === 0} sizes="100vw" className="object-cover" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Overlays keep type legible over any photograph */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/55 to-black/30 md:via-forest-deep/25" aria-hidden />
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-forest-deep/40 to-transparent md:w-2/3" aria-hidden />

      <div className="container-luxe relative flex h-full flex-col justify-end pb-24 md:pb-28">
        <motion.p
          className="eyebrow flex items-center gap-4 text-ivory/85"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
        >
          <span className="rule-gold" aria-hidden />
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          className="display-xl mt-6 max-w-5xl text-ivory"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45, ease }}
        >
          {hero.headline}
        </motion.h1>
        <motion.div
          className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease }}
        >
          <p className="max-w-xl text-base leading-relaxed text-ivory/80 md:text-lg">{hero.intro}</p>
          <ButtonLink href={hero.primaryLink.href} variant="outline-light" className="self-start md:self-auto">
            {hero.primaryLink.label}
          </ButtonLink>
        </motion.div>
      </div>

      {/* Slide controls */}
      {multiple && (
        <div className="absolute bottom-8 right-5 flex items-center gap-4 md:right-10 xl:right-16">
          <div className="flex gap-2">
            {hero.slides.map((slide, i) => (
              <button
                key={slide.src + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                className="group flex h-8 items-center"
              >
                <span
                  className={`block h-px transition-all duration-700 ${
                    i === index ? "w-10 bg-ivory" : "w-5 bg-ivory/40 group-hover:bg-ivory/80"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="flex size-8 items-center justify-center rounded-full border border-ivory/40 text-ivory hover:border-ivory"
          >
            {paused ? <Play className="size-3" aria-hidden /> : <Pause className="size-3" aria-hidden />}
          </button>
        </div>
      )}

      <a
        href="#content"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-ivory/80 hover:text-ivory md:flex"
      >
        <span className="eyebrow">{hero.scrollLabel}</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" strokeWidth={1} aria-hidden />
        </motion.span>
      </a>
    </section>
  );
}
