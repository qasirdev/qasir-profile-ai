"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/client";
import type { BlogPost } from "@/sanity/lib/types";
import Link from "next/link";

interface BlogHeaderProps {
  post: BlogPost;
}

const categoryColorMap = {
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
};

export function BlogHeader({ post }: BlogHeaderProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage.asset).width(1200).height(630).url()
    : null;

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="mb-8">
        <Link href="/blogs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
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

      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient text-balance leading-tight">
        {post.title}
      </h1>

      <p className="text-xl text-muted-foreground mb-8 text-balance max-w-3xl">
        {post.excerpt}
      </p>

      <div className="flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          {post.author.image && (
            <Image
              src={urlFor(post.author.image).width(48).height(48).url()}
              alt={post.author.name}
              width={48}
              height={48}
              className="rounded-full border-2 border-border glow-effect"
            />
          )}
          <div>
            <p className="font-semibold text-foreground">{post.author.name}</p>
            {post.author.role && (
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="h-12" />

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishedAt}>{publishedDate}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border-2 border-border glass-morphism glow-effect"
        >
          <Image
            src={imageUrl}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </motion.div>
      )}
    </motion.header>
  );
}
