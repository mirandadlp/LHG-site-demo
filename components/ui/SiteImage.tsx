import Image, { type ImageProps } from "next/image";
import type { Image as ContentImage } from "@/lib/schema";

type Props = Omit<ImageProps, "src" | "alt"> & { image: ContentImage };

/**
 * Wraps next/image for content images. SVG placeholders are served as-is;
 * real photography (JPG/PNG/WebP/AVIF) is resized and optimised automatically.
 */
export function SiteImage({ image, ...props }: Props) {
  const isSvg = image.src.toLowerCase().endsWith(".svg");
  return <Image src={image.src} alt={image.alt} unoptimized={isSvg} {...props} />;
}
