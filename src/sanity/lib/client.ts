import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-01";

if (!projectId) {
  console.warn("⚠️  Sanity project ID is not configured. Blog features will not work until you set NEXT_PUBLIC_SANITY_PROJECT_ID in .env");
}

export const client = createClient({
  projectId: projectId || "dummy",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});

export const previewClient = createClient({
  projectId: projectId || "dummy",
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function sanityFetch<T = unknown>(options: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  const { query, params = {}, revalidate, tags = [] } = options;

  if (!projectId) {
    return [] as T;
  }

  return fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, params }),
      next: {
        revalidate: revalidate ?? 3600,
        tags,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.result as T);
}
