import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBlogPostBySlug, getAllBlogSlugs, getRelatedBlogPosts } from "@/sanity/lib/queries";
import { BlogHeader } from "@/components/blog-header";
import { BlogContent } from "@/components/blog-content";
import { BlogCard } from "@/components/blog-card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt;
  const keywords = post.seo?.keywords || [];

  return {
    title: `${metaTitle} | Qasir Mehmood`,
    description: metaDescription,
    keywords: keywords.join(", "),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `https://qasir.co.uk/blogs/${slug}`,
      siteName: "Qasir Mehmood",
      images: post.mainImage?.asset
        ? [
            {
              url: post.mainImage.asset.url,
              width: 1200,
              height: 630,
              alt: post.mainImage.alt || post.title,
            },
          ]
        : [],
      locale: "en_GB",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.categories.map((cat) => cat.title),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: post.mainImage?.asset ? [post.mainImage.asset.url] : [],
      creator: "@qasirmehmood",
    },
  };
}

function BlogSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-12 w-3/4 bg-muted rounded animate-pulse" />
      <div className="h-6 w-full bg-muted rounded animate-pulse" />
      <div className="h-6 w-5/6 bg-muted rounded animate-pulse" />
      <div className="h-[400px] bg-muted rounded animate-pulse" />
    </div>
  );
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(
    post._id,
    post.categories.map((cat) => cat.slug.current),
    3
  );

  return (
    <>
      <article>
        <BlogHeader post={post} />
        <BlogContent content={post.body} />
      </article>

      {relatedPosts.length > 0 && (
        <>
          <Separator className="my-16" />
          <section>
            <h2 className="text-3xl font-bold mb-8 text-gradient">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <BlogCard key={relatedPost._id} post={relatedPost} index={index} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/10 dark:from-background dark:via-background dark:to-purple-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" aria-hidden="true" />
        
        <main className="container mx-auto px-4 py-24 max-w-4xl relative z-10">
          <Suspense fallback={<BlogSkeleton />}>
            <BlogPostContent slug={slug} />
          </Suspense>
        </main>
      </div>
    </>
  );
}
