"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight, Code } from "lucide-react";

const PortfolioSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const projects = [
    {
      title: "AI Daily Briefing Assistant",
      category: "Open Source / AI",
      description:
        "Production multi-agent daily briefing — LangGraph pipeline with 6 specialised agents plus Orchestrator, MCP (PostgreSQL + Google Calendar), CoALA memory, OWASP GenAI security, JIT consent and 70–90% prompt caching.",
      technologies: ["LangGraph", "FastAPI", "Python 3.12+", "Next.js 16", "React 19", "MCP", "PostgreSQL", "Supabase", "Docker", "Prometheus"],
      features: [
        "6 agents + Orchestrator (LangGraph)",
        "MCP integrations with RLS",
        "OWASP GenAI hardening",
        "OpenTelemetry observability",
        "Supabase & prompt caching"
      ],
      status: "Production",
      highlight: true,
      url: "https://github.com/qasirdev/daily-briefing",
      linkLabel: "View on GitHub",
    },
    {
      title: "AI Career Copilot (Job Discovery)",
      category: "Open Source / AI",
      description:
        "Enterprise-grade AI Career Copilot — 8-agent Temporal architecture: scrape → RAG rank → ATS cover letters, with pgvector semantic matching, Supabase auth and deep observability.",
      technologies: ["Temporal", "FastAPI", "Python 3.12+", "Next.js 16", "React 19", "pgvector", "Supabase", "Playwright", "Terraform", "LiteLLM"],
      features: [
        "8-agent Temporal workflows",
        "pgvector semantic job matching",
        "ATS-optimised cover letters",
        "OpenTelemetry & Prometheus",
        "Multi-cloud Terraform IaC"
      ],
      status: "Production",
      highlight: true,
      url: "https://github.com/qasirdev/job-discovery",
      linkLabel: "View on GitHub",
    },
    {
      title: "Azure AI Digital Transformation Platform",
      category: "Enterprise Platform",
      description:
        "Bilingual (English/Farsi) enterprise platform for Hecate Technologies with RTL/LTR support, real-time SSE collaboration and AI-powered content moderation.",
      technologies: ["Next.js 15", "TypeScript", "FastAPI", "Azure AI", "Cosmos DB", "Entra External ID", "Terraform"],
      features: [
        "Bilingual RTL/LTR support",
        "Server-Sent Events",
        "Azure AI sentiment & moderation",
        "Turborepo monorepo",
        "CI/CD automation"
      ],
      status: "Production",
      highlight: true,
      employer: "Hecate Technologies Limited",
    },
    {
      title: "Cloud Communications Platform (CPaaS)",
      category: "SaaS Platform",
      description:
        "Rebuilt and optimised large-scale frontend for IPCortex enterprise cloud communications, serving end-users, administrators and partners with distinct workflows.",
      technologies: ["Next.js", "React", "TypeScript", "FastAPI", "Azure Container Apps", "Jest", "Cypress"],
      features: [
        "95% reduction in product bugs",
        "40% page load improvement",
        "Internal RAG microservice",
        "UI/UX redesign across key journeys",
        "Terraform & CI/CD pipelines"
      ],
      status: "Production",
      highlight: false,
      employer: "IPCortex Ltd",
    },
    {
      title: "British Gas Energy Platform",
      category: "Enterprise Software",
      description:
        "Large-scale frontend and full-stack features for British Gas energy platforms — Energy Sales journeys, OAM dashboard and Next.js migration for millions of customers.",
      technologies: ["Next.js", "React", "TypeScript", "Redux", "Jest", "Cypress", "Adobe Analytics"],
      features: [
        "Energy Sales journey redesign",
        "OAM dashboard rebuild",
        "Legacy-to-Next.js migration",
        "30% fewer misdirected queries",
        "Accessibility & analytics integration"
      ],
      status: "Production",
      highlight: false,
      employer: "British Gas",
      url: "https://www.britishgas.co.uk/",
      linkLabel: "Visit British Gas",
    },
    {
      title: "Qasir Profile AI",
      category: "Portfolio / AI",
      description:
        "Production personal portfolio with an AI Digital Twin and Sanity CMS blog — dual Chatbase + OpenRouter providers, GROQ-powered /blogs, embedded Studio, SSE streaming, per-visit quotas and OpenRouter model fallback.",
      technologies: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "Sanity CMS",
        "Tailwind CSS v4",
        "ShadCN UI",
        "OpenRouter",
        "Chatbase",
        "Vitest",
        "Playwright",
      ],
      features: [
        "Sanity CMS blog (/blogs) with Portable Text",
        "Embedded Sanity Studio (/studio)",
        "AI Digital Twin (Chatbase + OpenRouter)",
        "SSE streaming & model fallback",
        "Vitest + Playwright test suite",
      ],
      status: "Production",
      highlight: false,
      url: "https://github.com/qasirdev/qasir-profile-ai",
      linkLabel: "View on GitHub",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Open Source / AI": "from-orange-500 to-red-500",
      "Enterprise Platform": "from-blue-500 to-cyan-500",
      "SaaS Platform": "from-green-500 to-emerald-500",
      "Enterprise Software": "from-purple-500 to-pink-500",
      "Portfolio / AI": "from-indigo-500 to-blue-500",
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Production: "bg-green-500/20 text-green-700 border-green-500/30",
      "In Development": "bg-blue-500/20 text-blue-700 border-blue-500/30",
      Completed: "bg-gray-500/20 text-gray-700 border-gray-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-700 border-gray-500/30";
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-gradient"
            variants={itemVariants}
          >
            Portfolio & Projects
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Verified projects from public GitHub repositories and enterprise work — multi-agent AI platforms, cloud-native applications and technical leadership
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`h-full glass-morphism hover:glow-effect transition-all duration-300 border-0 group ${
                  project.highlight ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-xs bg-gradient-to-r ${getCategoryColor(project.category)} text-white border-0`}
                        >
                          {project.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      {"employer" in project && project.employer && (
                        <p className="text-sm text-muted-foreground mt-1">{project.employer}</p>
                      )}
                    </div>
                    {project.highlight && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-primary">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.features.slice(0, 3).map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="text-xs px-2 py-1 bg-muted/50">
                          {feature}
                        </Badge>
                      ))}
                      {project.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2 text-primary">Technologies</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="text-xs border-border hover:bg-accent transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {project.url && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        asChild
                      >
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          {project.linkLabel?.includes("GitHub") ? (
                            <Code className="h-3 w-3 mr-1" />
                          ) : null}
                          {project.linkLabel ?? "View project"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label="Open project">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-0 max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">More on GitHub</h3>
                <p className="text-muted-foreground mb-6">
                  Explore all public repositories including Azure AI examples, FastAPI practice projects and earlier full-stack work.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  asChild
                >
                  <a href="https://github.com/qasirdev?tab=repositories" target="_blank" rel="noopener noreferrer">
                    View GitHub Profile
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
