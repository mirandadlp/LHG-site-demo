import Link from "next/link";
import { notFound } from "next/navigation";
import { getSocialSubpage, socialResponsibility } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageTemplate } from "@/components/sections/PageTemplate";

export function generateStaticParams() {
  return socialResponsibility.subpages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/social-responsibility/[slug]">) {
  const page = getSocialSubpage((await params).slug);
  return page ? pageMetadata(page.meta, page.path, page.hero.image?.src) : {};
}

export default async function SocialSubpage({ params }: PageProps<"/social-responsibility/[slug]">) {
  const page = getSocialSubpage((await params).slug);
  if (!page) notFound();
  const siblings = socialResponsibility.subpages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <PageTemplate page={page} />
      <nav aria-label="More on social responsibility" className="bg-forest py-16 text-ivory md:py-20">
        <div className="container-luxe">
          <p className="eyebrow text-gold">Social Responsibility</p>
          <ul className="mt-8 grid gap-x-10 border-t border-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((p) => (
              <li key={p.slug} className="border-b border-ivory/15">
                <Link href={p.path} className="block py-5 font-serif text-2xl font-light transition-colors hover:text-gold">
                  {p.hero.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
