"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/lib/client";
import type { BlogListItem } from "@/sanity/lib/types";

interface BlogCardProps {
  post: BlogListItem;
  featured?: boolean;
  index?: number;
}

const categoryColorMap = {
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
};

export function BlogCard({ post, featured = false, index = 0 }: BlogCardProps) {
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage.asset).width(800).height(450).url()
    : null;

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/blogs/${post.slug.current}`} className="block h-full">
        <Card className={`h-full overflow-hidden hover-lift glass-morphism border-2 ${featured ? "glow-effect" : ""}`}>
          {imageUrl && (
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}

          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories?.map((category) => (
                <Badge
                  key={category._id}
                  variant="outline"
                  className={categoryColorMap[category.color] || categoryColorMap.purple}
                >
                  {category.title}
                </Badge>
              ))}
            </div>
            <h3 className="text-xl font-bold line-clamp-2 text-balance group-hover:text-gradient transition-colors">
              {post.title}
            </h3>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground line-clamp-3 text-balance">{post.excerpt}</p>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>{publishedDate}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {post.author && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).width(40).height(40).url()}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-border"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-xs text-muted-foreground">{post.author.role}</p>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
