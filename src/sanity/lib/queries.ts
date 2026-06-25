import { sanityFetch } from "./client";
import type { BlogPost, BlogListItem, Category } from "./types";

export async function getAllBlogPosts(): Promise<BlogListItem[]> {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage {
      asset->,
      alt
    },
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    "author": author-> {
      _id,
      name,
      slug,
      role,
      "image": image.asset->
    },
    publishedAt,
    readTime,
    featured
  }`;

  return sanityFetch<BlogListItem[]>({
    query,
    tags: ["blogPost"],
    revalidate: 60,
  });
}

export async function getFeaturedBlogPosts(): Promise<BlogListItem[]> {
  const query = `*[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage {
      asset->,
      alt
    },
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    "author": author-> {
      _id,
      name,
      slug,
      role,
      "image": image.asset->
    },
    publishedAt,
    readTime,
    featured
  }`;

  return sanityFetch<BlogListItem[]>({
    query,
    tags: ["blogPost"],
    revalidate: 300,
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage {
      asset->,
      alt
    },
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color,
      description
    },
    "author": author-> {
      _id,
      name,
      slug,
      role,
      bio,
      "image": image.asset->,
      social
    },
    publishedAt,
    readTime,
    body,
    seo,
    featured
  }`;

  return sanityFetch<BlogPost | null>({
    query,
    params: { slug },
    tags: [`blogPost:${slug}`],
    revalidate: 60,
  });
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const query = `*[_type == "blogPost"].slug.current`;

  return sanityFetch<string[]>({
    query,
    tags: ["blogPost"],
    revalidate: 3600,
  });
}

export async function getAllCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }`;

  return sanityFetch<Category[]>({
    query,
    tags: ["category"],
    revalidate: 3600,
  });
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogListItem[]> {
  const query = `*[_type == "blogPost" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage {
      asset->,
      alt
    },
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    "author": author-> {
      _id,
      name,
      slug,
      role,
      "image": image.asset->
    },
    publishedAt,
    readTime,
    featured
  }`;

  return sanityFetch<BlogListItem[]>({
    query,
    params: { categorySlug },
    tags: ["blogPost", `category:${categorySlug}`],
    revalidate: 60,
  });
}

export async function getRelatedBlogPosts(currentPostId: string, categories: string[], limit = 3): Promise<BlogListItem[]> {
  const query = `*[_type == "blogPost" && _id != $currentPostId && count((categories[]->slug.current)[@ in $categories]) > 0] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage {
      asset->,
      alt
    },
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    "author": author-> {
      _id,
      name,
      slug,
      role,
      "image": image.asset->
    },
    publishedAt,
    readTime,
    featured
  }`;

  return sanityFetch<BlogListItem[]>({
    query,
    params: { currentPostId, categories, limit },
    tags: ["blogPost"],
    revalidate: 300,
  });
}
