import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "color",
      title: "Badge Color",
      type: "string",
      options: {
        list: [
          { title: "Purple", value: "purple" },
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Orange", value: "orange" },
          { title: "Pink", value: "pink" },
          { title: "Cyan", value: "cyan" },
        ],
      },
      initialValue: "purple",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
