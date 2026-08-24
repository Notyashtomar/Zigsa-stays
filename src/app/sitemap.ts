import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return ["", "/rooms", "/dine", "/location", "/gallery", "/book"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
