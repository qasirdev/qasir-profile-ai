import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageAssetDocument } from "next-sanity";

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SanityImage {
  asset: SanityImageAssetDocument;
  alt?: string;
  caption?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: SanitySlug;
  image?: SanityImageAssetDocument;
  bio?: PortableTextBlock[];
  role?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  color: "purple" | "blue" | "green" | "orange" | "pink" | "cyan";
}

export interface BlogListItem {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt: string;
  mainImage: SanityImage;
  categories: Category[];
  author: Author;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export interface BlogPost extends BlogListItem {
  body: PortableTextBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}
