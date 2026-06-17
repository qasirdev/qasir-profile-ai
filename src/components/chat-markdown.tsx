"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

type ChatMarkdownProps = {
  content: string;
  isStreaming?: boolean;
  className?: string;
};

export function sanitizeAssistantContent(content: string): string {
  return content.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
}

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h1 className="mb-3 mt-4 text-base font-semibold text-foreground first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-sm font-semibold text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 text-sm font-semibold text-foreground first:mt-0">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-primary/40 pl-3 text-muted-foreground last:mb-0">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-4 border-border" />,
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes("language-"));

    if (isBlock) {
      return (
        <code className={cn("font-mono text-xs text-foreground", className)}>
          {children}
        </code>
      );
    }

    return (
      <code className="rounded bg-background/70 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-md border border-border/60 bg-background/80 p-3 font-mono text-xs leading-relaxed last:mb-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border bg-background/50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1.5 font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-border/60 px-2 py-1.5 align-top">{children}</td>
  ),
};

export function ChatMarkdown({
  content,
  isStreaming = false,
  className,
}: ChatMarkdownProps) {
  const sanitized = sanitizeAssistantContent(content);

  if (!sanitized) {
    return isStreaming ? (
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block h-4 w-2 bg-current"
        aria-hidden
      />
    ) : null;
  }

  return (
    <div className={cn("text-sm leading-relaxed [&>*:first-child]:mt-0", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {sanitized}
      </ReactMarkdown>
      {isStreaming ? (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-0.5 inline-block h-4 w-2 bg-current align-middle"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
