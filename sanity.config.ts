'use client'

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./src/sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "qasir-profile",
  title: "Qasir Profile Blog",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool(), codeInput()],
  schema: {
    types: schemaTypes,
  },
});
