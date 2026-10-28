"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Navigation, Site } from "@/lib/schema";
import { Logo } from "./Logo";
import { NavDrawer } from "./NavDrawer";

export function Header({ navigation, site }: { navigation: Navigation; site: Site }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Tuck the header away while scrolling down, bring it back on scroll up.
      setHidden(y > 480 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled;
  const text = solid ? "text-forest" : "text-ivory";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color,box-shadow] duration-700 ease-[var(--ease-luxe)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "bg-ivory/95 shadow-[0_1px_0_var(--color-stone)] backdrop-blur-md" : "bg-gradient-to-b from-black/45 to-transparent"}`}
      >
        <div className={`container-luxe grid h-20 grid-cols-[1fr_auto_1fr] items-center md:h-24 ${text}`}>
          <div>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-navigation"
              className="group -ml-2 flex items-center gap-4 p-2"
            >
              <span className="flex w-8 flex-col gap-[7px]" aria-hidden>
                <span className="h-px w-full bg-current transition-all duration-500 group-hover:w-6" />
                <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-full" />
              </span>
              <span className="eyebrow hidden sm:inline">{navigation.menuLabel}</span>
              <span className="sr-only sm:hidden">{navigation.menuLabel}</span>
            </button>
          </div>

          <Link href="/" aria-label={`${site.name} — home`} className="justify-self-center">
            <Logo logo={site.logo} onDark={!solid} />
          </Link>

          <div className="justify-self-end">
            <Link
              href={navigation.headerCta.href}
              className={`eyebrow inline-flex min-h-11 items-center rounded-full border px-4 transition-colors duration-500 sm:px-5 md:px-7 ${
                solid
                  ? "border-heritage bg-heritage text-ivory hover:bg-forest"
                  : "border-ivory/70 text-ivory hover:bg-ivory hover:text-forest"
              }`}
            >
              {navigation.headerCta.label}
            </Link>
          </div>
        </div>
      </header>

      <NavDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          menuButton.current?.focus();
        }}
        onNavigate={() => setOpen(false)}
        navigation={navigation}
        site={site}
      />
    </>
  );
}
