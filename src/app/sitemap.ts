import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/resume.txt`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
