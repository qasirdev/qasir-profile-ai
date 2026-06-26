import { Metadata } from "next";
import { Suspense } from "react";
import { getAllBlogPosts, getFeaturedBlogPosts } from "@/sanity/lib/queries";
import { BlogCard } from "@/components/blog-card";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import Navigation from "@/components/navigation";

export const metadata: Metadata = {
  title: "Blog | Qasir Mehmood",
  description:
    "Insights on full-stack development, cloud architecture, AI/ML, and modern web technologies. Production-grade tutorials and real-world solutions.",
  openGraph: {
    title: "Blog | Qasir Mehmood",
    description:
      "Insights on full-stack development, cloud architecture, AI/ML, and modern web technologies.",
    url: "https://qasir.co.uk/blogs",
    siteName: "Qasir Mehmood",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Qasir Mehmood",
    description:
      "Insights on full-stack development, cloud architecture, AI/ML, and modern web technologies.",
  },
};

export const revalidate = 60;

function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-[450px] rounded-lg glass-morphism animate-pulse" />
      ))}
    </div>
  );
}

async function BlogList() {
  const [featuredPosts, allPosts] = await Promise.all([
    getFeaturedBlogPosts(),
    getAllBlogPosts(),
  ]);

  const regularPosts = allPosts.filter((post) => !post.featured);

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">No blog posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold text-gradient">Featured Posts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <BlogCard key={post._id} post={post} featured index={index} />
            ))}
          </div>
          {regularPosts.length > 0 && <Separator className="mt-16" />}
        </section>
      )}

      {regularPosts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8 text-foreground">All Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <BlogCard key={post._id} post={post} index={index + featuredPosts.length} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function BlogsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/10 dark:from-background dark:via-background dark:to-purple-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" aria-hidden="true" />
        
        <main className="container mx-auto px-4 py-24 relative z-10">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">Blog</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Insights on full-stack development, cloud architecture, AI/ML, and modern web
              technologies. Real production code, architectural patterns, and lessons learned from
              building scalable systems.
            </p>
          </header>

          <Suspense fallback={<BlogListSkeleton />}>
            <BlogList />
          </Suspense>
        </main>
      </div>
    </>
  );
}
