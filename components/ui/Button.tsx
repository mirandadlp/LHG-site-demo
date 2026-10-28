import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";

type Variant = "solid" | "outline-dark" | "outline-light" | "ivory";

const variants: Record<Variant, string> = {
  solid: "bg-heritage text-ivory hover:bg-forest border border-heritage",
  "outline-dark": "border border-heritage/40 text-heritage hover:bg-heritage hover:text-ivory hover:border-heritage",
  "outline-light": "border border-ivory/60 text-ivory hover:bg-ivory hover:text-forest hover:border-ivory",
  ivory: "bg-ivory text-forest border border-ivory hover:bg-transparent hover:text-ivory",
};

export const buttonClasses = (variant: Variant = "solid") =>
  `group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-[var(--ease-luxe)] ${variants[variant]}`;

export function ButtonLink({
  variant = "solid",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={`${buttonClasses(variant)} ${className}`} {...props}>
      {children}
    </Link>
  );
}

/** Understated text link with an arrow, used for "Learn more" style actions. */
export function ArrowLink({
  className = "",
  children,
  tone = "dark",
  ...props
}: ComponentProps<typeof Link> & { tone?: "dark" | "light" }) {
  const color = tone === "dark" ? "text-heritage" : "text-ivory";
  return (
    <Link
      className={`group inline-flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] ${color} ${className}`}
      {...props}
    >
      <span className="link-draw pb-1">{children}</span>
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-1"
        strokeWidth={1.25}
      />
    </Link>
  );
}
