import type { MetadataRoute } from "next";

/**
 * Search engines are blocked unless ALLOW_INDEXING=true, so preview and staging
 * deployments of this draft site are never indexed. Set it on the production deployment.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  if (process.env.ALLOW_INDEXING !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/brand-guide"] },
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
