"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Download, ArrowDown, Code, Briefcase } from "lucide-react";
import { PROFILE_DATA } from "@/lib/constants";
import { useAnalytics } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";

const HeroSection = () => {
  const { trackEvent, trackClick } = useAnalytics();
  const { scrollY } = useScroll();
  useScrollTracking({ threshold: [25, 50, 75] });
  const prefersReducedMotion = useReducedMotion();
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const titles = [
    "Senior Full-Stack Developer",
    "Azure AI Engineer (AI-102)",
    "Generative AI & Agentic AI Solutions",
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [titles.length, prefersReducedMotion]);

  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleCTAClick = (action: string, label: string) => {
    trackClick({ element: "cta_button", text: label, position: { x: 0, y: 0 } });
    trackEvent({ action, category: "user_interaction", label });
  };

  const handleDownloadCv = () => {
    handleCTAClick("download_cv", "Download CV");
    window.open(PROFILE_DATA.cvDownloadUrl, "_blank", "noopener,noreferrer");
  };

  const handleGetInTouch = () => {
    handleCTAClick("get_in_touch", "Get In Touch");
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSocialClick = (platform: string, url: string) => {
    trackClick({ element: "social_link", text: platform, position: { x: 0, y: 0 } });
    trackEvent({ action: "social_click", category: "user_interaction", label: platform });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: prefersReducedMotion ? 0 : 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: prefersReducedMotion ? 0 : 0.5 } },
  };

  const rotatingTitle = prefersReducedMotion ? titles[0] : titles[currentTitleIndex];

  return (
    <section
      aria-label="Introduction"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-purple-50/10 dark:from-background dark:via-background dark:to-purple-950/20"
    >
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 motion-safe-only"
        style={prefersReducedMotion ? undefined : { y: y1 }}
      />
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ y: y2 }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ y: y1 }}
            aria-hidden="true"
          />
        </>
      )}

      <motion.div
        className="container mx-auto px-4 z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={prefersReducedMotion ? undefined : { opacity }}
      >
        <motion.div variants={itemVariants}>
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 p-1 glow-effect relative overflow-hidden">
              <Image
                src={PROFILE_DATA.profilePhotoUrl}
                alt={`${PROFILE_DATA.name} — professional headshot`}
                width={128}
                height={128}
                className="w-full h-full rounded-full object-cover bg-background"
                priority
              />
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 text-balance"
          variants={itemVariants}
        >
          <span className="text-gradient inline-block">{PROFILE_DATA.name}</span>
        </motion.h1>

        <motion.div
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto text-balance leading-relaxed min-h-8 flex items-center justify-center"
          variants={itemVariants}
          aria-live={prefersReducedMotion ? undefined : "polite"}
        >
          <span className="text-gradient font-semibold">{rotatingTitle}</span>
        </motion.div>

        <motion.p
          className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-balance leading-relaxed"
          variants={itemVariants}
        >
          {PROFILE_DATA.summary.split("\n\n")[0]}
        </motion.p>

        {/* Plain HTML contact — crawlable without JS */}
        <address className="not-italic text-sm text-muted-foreground mb-10 space-y-1">
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
        </address>

        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-12"
          variants={itemVariants}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg glow-effect"
            onClick={handleDownloadCv}
          >
            <Download className="mr-2 h-5 w-5" aria-hidden="true" />
            Download CV
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-2 hover:bg-accent"
            onClick={handleGetInTouch}
          >
            <Mail className="mr-2 h-5 w-5" aria-hidden="true" />
            Get In Touch
          </Button>
          <Button size="lg" variant="secondary" className="px-6 py-6 text-lg" asChild>
            <a href="/resume">Plain-text Resume</a>
          </Button>
        </motion.div>

        <motion.div className="flex gap-6 justify-center mb-16" variants={itemVariants}>
          <motion.button
            type="button"
            onClick={() => handleSocialClick("GitHub", PROFILE_DATA.github)}
            className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-full hover:bg-accent"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
            aria-label="Visit GitHub profile"
          >
            <Code className="h-6 w-6" aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleSocialClick("LinkedIn", PROFILE_DATA.linkedin)}
            className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-full hover:bg-accent"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
            aria-label="Visit LinkedIn profile"
          >
            <Briefcase className="h-6 w-6" aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleSocialClick("Email", `mailto:${PROFILE_DATA.email}`)}
            className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-full hover:bg-accent"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
            aria-label={`Email ${PROFILE_DATA.email}`}
          >
            <Mail className="h-6 w-6" aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleSocialClick("Website", PROFILE_DATA.website)}
            className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-full hover:bg-accent"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
            aria-label="Visit personal website"
          >
            <ExternalLink className="h-6 w-6" aria-hidden="true" />
          </motion.button>
        </motion.div>

        {!prefersReducedMotion && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          >
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default HeroSection;
