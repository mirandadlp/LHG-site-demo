"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem, Navigation, Site } from "@/lib/schema";
import { SocialIcons } from "@/components/ui/SocialIcons";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
  navigation: Navigation;
  site: Site;
};

/** Walks the menu tree along a list of child indexes, e.g. [5, 0] = Discover › About LHG. */
function resolveTrail(items: NavItem[], path: number[]) {
  const trail: NavItem[] = [];
  let level = items;
  for (const index of path) {
    const item = level[index];
    if (!item?.children) break;
    trail.push(item);
    level = item.children;
  }
  return { trail, items: level };
}

export function NavDrawer({ open, onClose, onNavigate, navigation, site }: Props) {
  // Each entry is the index of the item opened at that depth.
  const [path, setPath] = useState<number[]>([]);
  const [direction, setDirection] = useState<1 | -1>(1);
  const panelRef = useRef<HTMLDivElement>(null);

  const { trail, items } = resolveTrail(navigation.primary, path);
  const parent = trail.at(-1);
  const depth = trail.length;

  const close = useCallback(() => {
    onClose();
    setPath([]);
  }, [onClose]);

  const navigate = () => {
    onNavigate();
    setPath([]);
  };

  const goDeeper = (index: number) => {
    setDirection(1);
    setPath((p) => [...p, index]);
  };

  const goBack = () => {
    setDirection(-1);
    setPath((p) => p.slice(0, -1));
  };

  // Lock page scroll, close on Escape and keep keyboard focus inside the panel while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Move focus to the start of each newly shown menu level.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-level-focus]")?.focus();
    }, 80);
    return () => window.clearTimeout(id);
  }, [open, path]);

  const showOverview = parent?.href && !items.some((i) => i.href === parent.href);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" id="site-navigation">
          <motion.div
            className="absolute inset-0 bg-forest-deep/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            onClick={close}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute inset-y-0 left-0 flex w-full flex-col overflow-hidden bg-forest text-ivory shadow-2xl sm:w-[min(32rem,92vw)]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Top bar */}
            <div className="flex h-20 shrink-0 items-center justify-between px-6 md:h-24 md:px-10">
              <button
                type="button"
                onClick={close}
                className="group -ml-2 flex items-center gap-4 p-2"
                {...(depth === 0 ? { "data-level-focus": true } : {})}
              >
                <X className="size-6 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1} aria-hidden />
                <span className="eyebrow">{navigation.closeLabel}</span>
              </button>
              <span className="eyebrow text-sage">{site.shortName}</span>
            </div>

            {/* Menu levels */}
            <nav aria-label="Main" className="relative flex-1 overflow-y-auto overflow-x-hidden px-6 md:px-10">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={path.join("-") || "root"}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d * 48, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d * -48, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease }}
                  className="pb-10 pt-4 md:pt-8"
                >
                  {parent && (
                    <div className="mb-8 border-b border-ivory/15 pb-6">
                      <button
                        type="button"
                        onClick={goBack}
                        data-level-focus
                        className="group -ml-1 flex items-center gap-2 p-1 text-sage transition-colors hover:text-ivory"
                      >
                        <ChevronLeft
                          className="size-4 transition-transform duration-500 group-hover:-translate-x-1"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                        <span className="eyebrow">
                          {navigation.backLabel}
                          {trail.length > 1 && <span className="sr-only"> to {trail.at(-2)?.label}</span>}
                        </span>
                      </button>
                      {trail.length > 1 && (
                        <p className="eyebrow mt-5 text-sage/80">
                          {trail
                            .slice(0, -1)
                            .map((t) => t.label)
                            .join(" / ")}
                        </p>
                      )}
                      <p className={`${trail.length > 1 ? "mt-2" : "mt-5"} font-serif text-3xl font-light md:text-4xl`} aria-live="polite">
                        {parent.label}
                      </p>
                    </div>
                  )}

                  <ul className={depth === 0 ? "space-y-1 md:space-y-2" : "space-y-1"}>
                    {showOverview && parent?.href && (
                      <MenuRow depth={depth} index={-1}>
                        <Link href={parent.href} onClick={navigate} className={rowClass(depth)}>
                          <span>
                            {navigation.viewAllLabel}
                            <span className="sr-only"> — {parent.label}</span>
                          </span>
                        </Link>
                      </MenuRow>
                    )}
                    {items.map((item, index) => (
                      <MenuRow key={`${item.label}-${index}`} depth={depth} index={index}>
                        {item.children?.length ? (
                          <button
                            type="button"
                            onClick={() => goDeeper(index)}
                            aria-haspopup="true"
                            className={`${rowClass(depth)} w-full`}
                          >
                            <span className="flex items-baseline gap-4">
                              {depth === 0 && <Index n={index} />}
                              {item.label}
                            </span>
                            <ChevronRight
                              className="size-5 shrink-0 opacity-50 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"
                              strokeWidth={1}
                              aria-hidden
                            />
                          </button>
                        ) : item.href ? (
                          <Link href={item.href} onClick={navigate} className={rowClass(depth)}>
                            <span className="flex items-baseline gap-4">
                              {depth === 0 && <Index n={index} />}
                              {item.label}
                            </span>
                          </Link>
                        ) : null}
                      </MenuRow>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </nav>

            {/* Drawer footer */}
            <div className="shrink-0 border-t border-ivory/15 px-6 py-6 md:px-10 md:py-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1 text-sm text-ivory/70">
                  <p>{site.contact.phone}</p>
                  <p>{site.contact.email}</p>
                </div>
                <SocialIcons social={site.social} className="text-ivory" />
              </div>
              <Link
                href={navigation.headerCta.href}
                onClick={navigate}
                className="eyebrow mt-6 flex min-h-12 items-center justify-center border border-gold/70 text-ivory transition-colors duration-500 hover:bg-gold hover:text-forest"
              >
                {navigation.headerCta.label}
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function rowClass(depth: number) {
  const size =
    depth === 0
      ? "font-serif text-[1.9rem] font-light leading-tight md:text-[2.35rem]"
      : "font-serif text-[1.45rem] font-light md:text-[1.65rem]";
  return `group flex items-center justify-between gap-6 py-2 text-left text-ivory transition-colors duration-500 hover:text-gold focus-visible:text-gold ${size}`;
}

function Index({ n }: { n: number }) {
  return (
    <span className="w-6 shrink-0 font-sans text-[0.65rem] tracking-[0.2em] text-sage/80" aria-hidden>
      {String(n + 1).padStart(2, "0")}
    </span>
  );
}

function MenuRow({ children, depth, index }: { children: React.ReactNode; depth: number; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: (depth === 0 ? 0.25 : 0.05) + (index + 1) * 0.045, ease }}
    >
      {children}
    </motion.li>
  );
}
