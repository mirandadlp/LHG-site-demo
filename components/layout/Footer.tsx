import Link from "next/link";
import { footer, site } from "@/lib/content";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { CookieSettingsButton } from "@/components/privacy/CookieConsent";
import { Logo } from "./Logo";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  const [before, after] = footer.copyright.split("{year}");
  return (
    <footer className="bg-forest text-ivory">
      <div className="container-luxe grid gap-14 py-20 md:py-24 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm">
          <Link href="/" aria-label={`${site.name} — home`} className="inline-block">
            <Logo logo={site.logo} onDark />
          </Link>
          <p className="mt-8 text-sm leading-relaxed text-ivory/65">{footer.tagline}</p>
          <SocialIcons social={site.social} className="mt-8 text-ivory" />
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {footer.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="eyebrow text-gold">{col.heading}</h2>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="link-draw text-sm text-ivory/80 hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="eyebrow text-gold">{footer.contactHeading}</h2>
            <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed text-ivory/80">
              {site.contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block pt-3">{site.contact.phone}</span>
              <span className="block">{site.contact.email}</span>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-luxe flex flex-col gap-4 py-7 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>
            {before}
            {after !== undefined && <CurrentYear />}
            {after}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton label={footer.cookieSettingsLabel} className="hover:text-ivory" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
