"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, ExternalLink, Send } from "lucide-react";
import { PROFILE_DATA, SOCIAL_LINKS } from "@/lib/constants";
import { SOCIAL_ICONS } from "@/components/social-icon-link";
import { buildContactMailtoUrl, type ContactFormPayload } from "@/lib/contact-mailto";

const EMPTY_FORM: ContactFormPayload = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormPayload>(EMPTY_FORM);
  const [formKey, setFormKey] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = buildContactMailtoUrl(PROFILE_DATA.email, formData);
    window.open(mailtoUrl, "_blank", "noopener,noreferrer");
    setFormData(EMPTY_FORM);
    setFormKey((key) => key + 1);
  };

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

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: PROFILE_DATA.email,
      href: `mailto:${PROFILE_DATA.email}`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: PROFILE_DATA.phone,
      href: `tel:${PROFILE_DATA.phone}`,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: PROFILE_DATA.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(PROFILE_DATA.location)}`,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const socialLinks = SOCIAL_LINKS.filter((link) => link.id !== "email");

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
            Get In Touch
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Email is the fastest way to reach me. Use the compose form below only if you prefer
            drafting your message here first.
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Primary contact */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="glass-morphism border-0 ring-2 ring-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Preferred way to get in touch — opens your email app directly.
                  </p>

                  <Button
                    size="lg"
                    className="w-full mb-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    asChild
                  >
                    <a href={`mailto:${PROFILE_DATA.email}`}>
                      <Mail className="h-5 w-5 mr-2" />
                      Email {PROFILE_DATA.email}
                    </a>
                  </Button>

                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <a
                        key={index}
                        href={method.href}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-all duration-300 group"
                      >
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{method.label}</p>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {method.value}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-morphism border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((link) => {
                      const Icon = SOCIAL_ICONS[link.icon];
                      return (
                        <a
                          key={link.id}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                          aria-label={link.ariaLabel}
                        >
                          <Badge
                            variant="outline"
                            className={`px-4 py-2 text-sm font-medium bg-gradient-to-r ${link.gradientClass} text-white border-0 hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center`}
                          >
                            <Icon className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
                            {link.name}
                            <ExternalLink className="h-3 w-3 ml-2" aria-hidden="true" />
                          </Badge>
                        </a>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Open to Opportunities</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I&apos;m always interested in discussing senior frontend, full-stack, AI
                      engineering, and technical lead roles. Whether you&apos;re building the next
                      generation of web applications or need expertise in AI integration, I&apos;d
                      love to hear from you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Backup: compose then open mailto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="glass-morphism border-0 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Compose a Message</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Simply fill in your details to open your email app, fully pre-populated and
                    ready to send. The email is sent from your own account, nothing is transmitted
                    from this website.
                  </p>

                  <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="bg-background border-border focus:border-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Your email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          className="bg-background border-border focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What's this about?"
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell me about your project, ideas, or questions..."
                        className="bg-background border-border focus:border-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full border-2"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Open in email app
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
