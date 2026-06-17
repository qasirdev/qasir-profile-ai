import type { Metadata } from "next";
import Link from "next/link";
import { fetchResumeText } from "@/lib/fetch-resume";
import { PROFILE_DATA, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume — Qasir Mehmood",
  description:
    "Plain-text resume of Qasir Mehmood — Senior Full-Stack Developer, Azure AI Engineer (AI-102). Next.js, React, TypeScript, FastAPI, RAG, LangGraph, Temporal, MCP.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/resume`,
  },
};

export default async function ResumePage() {
  const resumeText = await fetchResumeText();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <nav className="mb-8 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-primary underline underline-offset-4">
            ← Back to portfolio
          </Link>
          <a
            href={PROFILE_DATA.cvDownloadUrl}
            className="text-primary underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download CV (PDF)
          </a>
          <a
            href="/resume.txt"
            className="text-primary underline underline-offset-4"
          >
            Raw text (.txt)
          </a>
        </nav>

        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold mb-2">{PROFILE_DATA.name}</h1>
          <address className="mt-4 not-italic text-sm text-muted-foreground space-y-1">
            <div>
              <a href={`mailto:${PROFILE_DATA.email}`}>{PROFILE_DATA.email}</a>
            </div>
            <div>
              <a href={`tel:${PROFILE_DATA.phone}`}>{PROFILE_DATA.phone}</a>
            </div>
            <div>{PROFILE_DATA.location}</div>
            <div>
              <a href={PROFILE_DATA.linkedin}>LinkedIn</a>
              {" · "}
              <a href={PROFILE_DATA.github}>GitHub</a>
              {" · "}
              <a href={PROFILE_DATA.website}>{PROFILE_DATA.website}</a>
            </div>
          </address>
          <p className="mt-4 text-xs text-muted-foreground">
            Loaded from GitHub — updates within ~1 hour of CV changes, no site redeploy required.
          </p>
        </header>

        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
          {resumeText}
        </pre>
      </div>
    </main>
  );
}
