import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import CareerTimeline from "@/components/career-timeline";
import SkillsSection from "@/components/skills-section";
import PortfolioSection from "@/components/portfolio-section";
import DigitalTwinOrchestrator from "@/components/digital-twin-orchestrator";
import ContactSection from "@/components/contact-section";
import { SeoKeywordsSection } from "@/components/seo-keywords-section";
import { PROFILE_DATA, BLOG_CMS } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <Navigation />

      <main id="main-content">
        <HeroSection />
        <div id="about">
          <AboutSection />
        </div>
        <div id="experience">
          <CareerTimeline />
        </div>
        <div id="skills">
          <SkillsSection />
        </div>
        <div id="portfolio">
          <PortfolioSection />
        </div>
        <DigitalTwinOrchestrator />
        <div id="contact">
          <ContactSection />
        </div>
        <SeoKeywordsSection />
      </main>

      <footer className="py-8 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 text-center space-y-3">
          <address className="not-italic text-sm text-muted-foreground space-y-1">
            <div>
              <a href={`mailto:${PROFILE_DATA.email}`} className="hover:text-foreground transition-colors">
                {PROFILE_DATA.email}
              </a>
              {" · "}
              <a href={`tel:${PROFILE_DATA.phone}`} className="hover:text-foreground transition-colors">
                {PROFILE_DATA.phone}
              </a>
            </div>
            <div>{PROFILE_DATA.location}</div>
            <div>
              <a href={PROFILE_DATA.linkedin} className="hover:text-foreground transition-colors">
                LinkedIn
              </a>
              {" · "}
              <a href={PROFILE_DATA.github} className="hover:text-foreground transition-colors">
                GitHub
              </a>
              {" · "}
              <a href={BLOG_CMS.listingPath} className="hover:text-foreground transition-colors">
                Blog
              </a>
              {" · "}
              <a href="/resume" className="hover:text-foreground transition-colors">
                Plain-text resume
              </a>
            </div>
          </address>
          <p className="text-muted-foreground text-sm">
            © 2026 {PROFILE_DATA.name}. Built with Next.js 16, React 19, TypeScript, {BLOG_CMS.provider} and the AI Digital Twin.
          </p>
        </div>
      </footer>
    </div>
  );
}
