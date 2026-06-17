"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROFILE_DATA } from "@/lib/constants";
import { useAnalytics } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";
import { Code, Database, Brain, Cloud, Cpu, Users } from "lucide-react";

function getSkillYears(skill: string): number | null {
  if (PROFILE_DATA.skillYears[skill] != null) {
    return PROFILE_DATA.skillYears[skill];
  }
  const normalized = skill.replace(/\s+/g, " ").trim();
  for (const [key, years] of Object.entries(PROFILE_DATA.skillYears)) {
    if (normalized.toLowerCase().includes(key.toLowerCase())) {
      return years;
    }
  }
  return null;
}

const SkillsSection = () => {
  const { trackEvent, trackClick } = useAnalytics();
  useScrollTracking({ threshold: [25, 50, 75] });

  const handleSkillClick = (category: string, skill: string) => {
    trackClick({ element: "skill_item", text: `${category}: ${skill}`, position: { x: 0, y: 0 } });
    trackEvent({ action: "skill_click", category: "user_interaction", label: `${category}: ${skill}` });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const skillCategories = [
    { title: "Frontend", icon: Code, skills: PROFILE_DATA.skills.frontend, color: "from-blue-500 to-cyan-500" },
    { title: "Backend", icon: Database, skills: PROFILE_DATA.skills.backend, color: "from-green-500 to-emerald-500" },
    { title: "AI & ML", icon: Brain, skills: PROFILE_DATA.skills.ai, color: "from-purple-500 to-pink-500" },
    { title: "Cloud & DevOps", icon: Cloud, skills: PROFILE_DATA.skills.cloud, color: "from-orange-500 to-red-500" },
    { title: "Architecture", icon: Cpu, skills: PROFILE_DATA.skills.architecture, color: "from-indigo-500 to-purple-500" },
    { title: "Leadership", icon: Users, skills: PROFILE_DATA.skills.leadership, color: "from-pink-500 to-rose-500" },
  ];

  const headlineYears = [
    { skill: "JavaScript", years: 12 },
    { skill: "React", years: 9 },
    { skill: "TypeScript", years: 9 },
    { skill: "Next.js", years: 4 },
    { skill: "Python", years: 4 },
    { skill: "Node.js", years: 5 },
    { skill: "Azure", years: 3 },
    { skill: "Terraform", years: 2 },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient" variants={itemVariants}>
            Skills & Expertise
          </motion.h2>
          <motion.p className="text-xl text-muted-foreground max-w-3xl mx-auto" variants={itemVariants}>
            Next.js, React, TypeScript, FastAPI, Azure AI, RAG, LangGraph, Temporal, MCP and cloud-native
            architecture — with verified years of hands-on experience
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {headlineYears.map((item) => (
            <motion.div key={item.skill} variants={itemVariants}>
              <Card className="glass-morphism border-0 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{item.years}+</div>
                  <div className="text-xs text-muted-foreground mt-1">years {item.skill}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillCategories.map((category, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full glass-morphism hover:glow-effect transition-all duration-300 border-0">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white mr-4`}
                    >
                      <category.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>

                  <ul className="space-y-2">
                    {category.skills.map((skill, skillIndex) => {
                      const years = getSkillYears(skill);
                      return (
                        <li key={skillIndex}>
                          <button
                            type="button"
                            onClick={() => handleSkillClick(category.title, skill)}
                            className="w-full flex justify-between items-center text-sm font-medium text-left hover:text-primary transition-colors rounded px-1 py-0.5"
                          >
                            <span>{skill}</span>
                            {years != null ? (
                              <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                                {years} {years === 1 ? "yr" : "yrs"}
                              </Badge>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Certifications & Achievements</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {PROFILE_DATA.certifications.map((cert, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
