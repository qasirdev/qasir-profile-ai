import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllBlogPosts } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      const blogPosts = await getAllBlogPosts();
      blogEntries = blogPosts.map((post) => ({
        url: `${base}/blogs/${post.slug.current}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.warn("Failed to fetch blog posts for sitemap:", error);
  }

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blogs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...blogEntries,
    { url: `${base}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/resume.txt`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/llms.txt`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
  ];
}
