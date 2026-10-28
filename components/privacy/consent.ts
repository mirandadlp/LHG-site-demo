/** Cookie consent state, shared by the banner, the footer link and the analytics loader. */
export type Consent = { necessary: true; analytics: boolean; version: number; updatedAt: string };

export const CONSENT_COOKIE = "lhg_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "lhg:consent-changed";
export const OPEN_SETTINGS_EVENT = "lhg:open-cookie-settings";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Consent;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean) {
  const consent: Consent = { necessary: true, analytics, version: CONSENT_VERSION, updatedAt: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  return consent;
}
