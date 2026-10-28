"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { OPEN_SETTINGS_EVENT, readConsent, writeConsent } from "./consent";

/**
 * Cookie banner + preferences panel. Only strictly necessary cookies are set
 * until the visitor opts in; analytics load only after consent (see Analytics.tsx).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Defer so the first paint is never blocked by the banner.
    const id = window.setTimeout(() => {
      const existing = readConsent();
      if (!existing) setVisible(true);
      else setAnalytics(existing.analytics);
    }, 600);
    const open = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setManaging(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(OPEN_SETTINGS_EVENT, open);
    };
  }, []);

  const save = (allowAnalytics: boolean) => {
    writeConsent(allowAnalytics);
    setVisible(false);
    setManaging(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl border border-stone bg-paper p-6 text-charcoal shadow-[0_20px_60px_-20px_rgba(0,46,33,0.35)] md:inset-x-auto md:left-6 md:bottom-6 md:p-8"
        >
          <h2 id="cookie-title" className="font-serif text-2xl text-forest">
            Your Privacy
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We use strictly necessary cookies to run this website. With your permission we would also like to use
            analytics cookies to understand how the site is used. Read our{" "}
            <Link href="/cookie-policy" className="text-heritage underline underline-offset-4">
              Cookie Policy
            </Link>
            .
          </p>

          {managing && (
            <div className="mt-5 space-y-4 border-t border-stone pt-5 text-sm">
              <label className="flex items-start justify-between gap-6">
                <span>
                  <span className="block font-medium text-forest">Strictly necessary</span>
                  <span className="text-muted">Required for the website to function. Always on.</span>
                </span>
                <input type="checkbox" checked disabled className="mt-1 size-4 accent-heritage" />
              </label>
              <label className="flex items-start justify-between gap-6">
                <span>
                  <span className="block font-medium text-forest">Analytics</span>
                  <span className="text-muted">Helps us measure and improve the website.</span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 size-4 accent-heritage"
                />
              </label>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {managing ? (
              <button type="button" onClick={() => save(analytics)} className="eyebrow min-h-11 bg-heritage px-6 text-ivory hover:bg-forest">
                Save Preferences
              </button>
            ) : (
              <>
                <button type="button" onClick={() => save(true)} className="eyebrow min-h-11 bg-heritage px-6 text-ivory hover:bg-forest">
                  Accept All
                </button>
                <button type="button" onClick={() => save(false)} className="eyebrow min-h-11 border border-heritage/40 px-6 text-heritage hover:border-heritage">
                  Necessary Only
                </button>
                <button type="button" onClick={() => setManaging(true)} className="eyebrow min-h-11 px-2 text-heritage underline underline-offset-4">
                  Manage
                </button>
              </>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      {label}
    </button>
  );
}
