import { Reveal } from "./Reveal";

export function SectionIntro({
  eyebrow,
  heading,
  intro,
  align = "left",
  tone = "dark",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
}) {
  const centered = align === "center";
  const eyebrowColor = tone === "dark" ? "text-gold-deep" : "text-gold-light";
  const headingColor = tone === "dark" ? "text-forest" : "text-ivory";
  const introColor = tone === "dark" ? "text-muted" : "text-ivory/75";
  return (
    <Reveal className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p className={`eyebrow flex items-center gap-4 ${eyebrowColor} ${centered ? "justify-center" : ""}`}>
          <span className="rule-gold" aria-hidden />
          {eyebrow}
        </p>
      )}
      {heading && <Heading className={`display-lg mt-5 ${headingColor}`}>{heading}</Heading>}
      {intro && <p className={`mt-6 text-base leading-relaxed md:text-lg ${introColor}`}>{intro}</p>}
    </Reveal>
  );
}
