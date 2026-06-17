"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, ExternalLink, GraduationCap } from "lucide-react";
import { PROFILE_DATA } from "@/lib/constants";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";

const CareerTimeline = () => {
  useScrollTracking({ threshold: [25, 50, 75] });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const alternateItemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
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
            Career Journey
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            12+ years of experience building enterprise-grade solutions and leading technical teams
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-purple-500 to-blue-500 rounded-full" />
            
            {PROFILE_DATA.experience.map((job, index) => (
              <motion.div
                key={index}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
                variants={index % 2 === 0 ? itemVariants : alternateItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background z-10" />
                
                {/* Content card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="glass-morphism hover:glow-effect transition-all duration-300 border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{job.period}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{job.role}</h3>
                      <h4 className="text-lg text-primary font-semibold mb-3">{job.company}</h4>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{job.location}</span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {job.description}
                      </p>
                      
                      <div className="space-y-2">
                        {job.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education & earlier roles — server-visible in DOM */}
          <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            <Card className="glass-morphism border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-bold">Education</h3>
                </div>
                <p className="font-semibold">{PROFILE_DATA.education.degree}</p>
                <p className="text-sm text-muted-foreground mt-1">Major: {PROFILE_DATA.education.major}</p>
                <p className="text-sm text-muted-foreground">{PROFILE_DATA.education.additional}</p>
              </CardContent>
            </Card>
            <Card className="glass-morphism border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Earlier Roles (2013–2017)</h3>
                <ul className="space-y-3">
                  {PROFILE_DATA.earlierRoles.map((role, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{role.role}</span>
                      <span className="text-muted-foreground"> — {role.company}</span>
                      <div className="text-xs text-muted-foreground">
                        {role.period} · {role.location}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to action */}
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
                <h3 className="text-2xl font-bold mb-4">Let&apos;s Build Something Amazing</h3>
                <p className="text-muted-foreground mb-6">
                  I&apos;m always open to discussing new opportunities, challenging projects, and innovative ideas.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
                  >
                    Get In Touch
                  </button>
                  <a
                    href={PROFILE_DATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerTimeline;
