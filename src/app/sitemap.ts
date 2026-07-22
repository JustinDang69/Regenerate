import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/* Static sitemap for phase-one routes. Extend when blog/articles ship (phase two). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/skin", "/hair", "/pricing", "/about", "/contact", "/products"];
  const now = new Date();
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
