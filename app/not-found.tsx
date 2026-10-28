import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-forest pt-24 text-ivory">
      <div className="container-luxe max-w-3xl text-center">
        <p className="eyebrow text-gold">Page not found</p>
        <h1 className="display-xl mt-6">We couldn’t find that page</h1>
        <p className="mx-auto mt-6 max-w-xl text-ivory/75">
          The page may have moved or no longer exists. Use the menu to continue exploring, or return to the homepage.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/" variant="ivory">
            Return Home
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline-light">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
