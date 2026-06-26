"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/client";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-12 text-gradient">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-bold mb-5 mt-10 text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-semibold mb-3 mt-6 text-foreground">{children}</h4>
    ),
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-6 text-balance">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-purple-500 pl-6 py-4 my-8 italic glass-morphism rounded-r-lg">
        <div className="text-lg text-muted-foreground">{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-3 mb-6 ml-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-3 mb-6 ml-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-lg leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-lg leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono border border-border">
        {children}
      </code>
    ),
    underline: ({ children }) => <u className="underline">{children}</u>,
    "strike-through": ({ children }) => <s className="line-through">{children}</s>,
    link: ({ children, value }) => {
      const target = value?.newWindow ? "_blank" : undefined;
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;
      return (
        <Link
          href={value?.href || "#"}
          target={target}
          rel={rel}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-4 transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }
      const imageUrl = urlFor(value.asset).width(1200).url();
      return (
        <figure className="my-10">
          <div className="relative w-full overflow-hidden rounded-lg border-2 border-border glass-morphism">
            <Image
              src={imageUrl}
              alt={value.alt || "Blog post image"}
              width={1200}
              height={675}
              className="w-full h-auto"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => {
      return (
        <div className="my-8">
          {value?.filename && (
            <div className="bg-muted border border-border rounded-t-lg px-4 py-2 text-sm font-mono text-muted-foreground">
              {value.filename}
            </div>
          )}
          <div className="bg-card border border-border rounded-b-lg overflow-x-auto">
            <pre className="p-6">
              <code className="text-sm font-mono leading-relaxed">{value?.code}</code>
            </pre>
          </div>
        </div>
      );
    },
  },
};

interface BlogContentProps {
  content: PortableTextBlock[];
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <PortableText value={content} components={components} />
    </article>
  );
}
