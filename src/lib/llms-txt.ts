import { PROFILE_DATA, SITE_URL, BLOG_CMS } from "@/lib/constants";

function siteBase(): string {
  return SITE_URL.replace(/\/$/, "");
}

/** Curated index for LLM and AI agent crawlers — https://llmstxt.org/ */
export function buildLlmsTxt(): string {
  const base = siteBase();

  return `# ${PROFILE_DATA.name}

> Senior Full-Stack Developer and Azure AI Engineer portfolio. Machine-readable resume, structured profile data, skills, experience, and project highlights for recruiters, search engines, and AI agents.

Open to senior full-stack, AI engineering, and technical lead opportunities. Contact: ${PROFILE_DATA.email} · ${PROFILE_DATA.location}.

## Primary

- [Home](${base}/): Portfolio homepage — about, experience, skills, projects, and contact.
- [Blog](${base}${BLOG_CMS.listingPath}): Technical articles on Next.js, React, cloud and AI — content managed in ${BLOG_CMS.provider}.
- [Plain-text resume](${base}/resume.txt): Full CV in plain text; preferred source for factual extraction and ATS parsing.
- [Resume page](${base}/resume): Human-readable resume with download links.

## Structured data & discovery

- [Sitemap](${base}/sitemap.xml): Canonical URL list for crawlers.
- [Robots](${base}/robots.txt): Crawler directives; \`/api/\` and \`/admin/\` are disallowed.
- [Person schema](${base}/): Schema.org Person JSON-LD embedded on the homepage.

## External profiles

- [LinkedIn](${PROFILE_DATA.linkedin}): Professional profile and career history.
- [GitHub](${PROFILE_DATA.github}): Open-source repositories and code samples.
- [CV (PDF)](${PROFILE_DATA.cvDownloadUrl}): Downloadable PDF resume.

## Optional

- [Sanity Studio](${base}${BLOG_CMS.studioPath}): Embedded ${BLOG_CMS.provider} editor for blog posts (authenticated).
- [Open Graph image](${base}/opengraph-image): Social preview image for link sharing.
- [Site repository](https://github.com/qasirdev/qasir-profile-ai): Source code for this portfolio (Next.js, React, TypeScript, AI Digital Twin).
- [Resume source (Markdown)](${PROFILE_DATA.resumeTextUrl}): Upstream markdown CV used to generate \`/resume.txt\`.
`;
}
