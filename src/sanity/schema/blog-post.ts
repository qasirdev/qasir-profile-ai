import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(200),
      description: "Short description for blog cards and SEO (max 200 chars)",
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(60),
      description: "Estimated reading time in minutes",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "newWindow",
                    type: "boolean",
                    title: "Open in new window",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "code",
          title: "Code Block",
          options: {
            language: "typescript",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "Python", value: "python" },
              { title: "Go", value: "go" },
              { title: "Rust", value: "rust" },
              { title: "Java", value: "java" },
              { title: "C#", value: "csharp" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "SCSS", value: "scss" },
              { title: "JSON", value: "json" },
              { title: "Markdown", value: "markdown" },
              { title: "Shell", value: "shell" },
              { title: "SQL", value: "sql" },
              { title: "YAML", value: "yaml" },
            ],
            withFilename: true,
          },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          type: "string",
          title: "Meta Title",
          validation: (Rule) => Rule.max(60),
          description: "SEO title (max 60 chars, leave empty to use post title)",
        },
        {
          name: "metaDescription",
          type: "text",
          title: "Meta Description",
          rows: 3,
          validation: (Rule) => Rule.max(160),
          description: "SEO description (max 160 chars, leave empty to use excerpt)",
        },
        {
          name: "keywords",
          type: "array",
          title: "Keywords",
          of: [{ type: "string" }],
          options: { layout: "tags" },
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      description: "Display this post prominently on the blog homepage",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      publishedAt: "publishedAt",
    },
    prepare(selection) {
      const { author, publishedAt } = selection;
      return {
        ...selection,
        subtitle: author && publishedAt ? `${author} · ${new Date(publishedAt).toLocaleDateString()}` : "",
      };
    },
  },
  orderings: [
    {
      title: "Publishing Date, New",
      name: "publishingDateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Publishing Date, Old",
      name: "publishingDateAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});
