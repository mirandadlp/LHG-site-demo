import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { resolvedNavigation, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/privacy/CookieConsent";
import { Analytics } from "@/components/privacy/Analytics";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: site.defaultMeta.title, template: `%s | ${site.name}` },
  description: site.defaultMeta.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "en_GB", type: "website", images: [site.ogImage] },
};

export const viewport: Viewport = {
  themeColor: "#002e21",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="eyebrow sr-only z-[100] bg-ivory px-5 py-3 text-forest focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header navigation={resolvedNavigation} site={site} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
