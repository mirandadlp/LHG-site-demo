"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, type Consent } from "./consent";

/**
 * Loads Google Analytics 4 only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set
 * AND the visitor has accepted analytics cookies.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(readConsent()?.analytics ?? false);
    const id = window.setTimeout(sync, 0);
    const onChange = (e: Event) => setAllowed((e as CustomEvent<Consent>).detail.analytics);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(CONSENT_EVENT, onChange);
    };
  }, []);

  if (!id || !allowed) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
