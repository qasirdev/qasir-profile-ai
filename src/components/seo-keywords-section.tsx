import { SEO_KEYWORDS } from "@/lib/resume-content";

/** Server-rendered keyword-rich copy for crawlers and recruiters */
export function SeoKeywordsSection() {
  return (
    <section
      aria-label="Technical expertise summary"
      className="border-t border-border/40 bg-muted/10 py-10"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Technical Focus</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{SEO_KEYWORDS}.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Production experience with multi-agent AI systems (LangGraph, Temporal, MCP), enterprise
          cloud platforms on Microsoft Azure, and full-stack delivery using Next.js, React,
          TypeScript, Python 3.12+ and FastAPI.
        </p>
        <p className="mt-3 text-sm">
          <a href="/resume" className="text-primary underline underline-offset-4 hover:opacity-80">
            View plain-text resume (ATS-friendly)
          </a>
          {" · "}
          <a
            href="https://github.com/qasirdev/qasir-profile-ai/raw/main/cv/qasir-mehmood-cv.pdf"
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            Download CV (PDF)
          </a>
        </p>
      </div>
    </section>
  );
}
