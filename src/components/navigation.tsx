"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { openDigitalTwin } from "@/lib/digital-twin-events";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    handleScroll();
    checkDarkMode();

    window.addEventListener("scroll", handleScroll);

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Blog", href: "/blogs", isRoute: true as const },
    { label: "Resume", href: "/resume", isRoute: true as const },
    { label: "AI Chat", href: "#ai-chat", action: "open-digital-twin" as const },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (item.action === "open-digital-twin") {
      openDigitalTwin();
      setIsOpen(false);
      return;
    }

    if ("isRoute" in item && item.isRoute) {
      router.push(item.href);
      setIsOpen(false);
      return;
    }

    // For hash anchor links
    const isHomePage = pathname === "/";
    
    if (!isHomePage) {
      // If not on home page, navigate to home with hash
      router.push(`/${item.href}`);
      setIsOpen(false);
      return;
    }

    // If on home page, just scroll to element
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      // If on home page, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If on another page, navigate to home
      router.push("/");
    }
  };

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-morphism border-b border-border/20 backdrop-blur-md"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer"
              aria-label="Qasir Mehmood — home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">QM</span>
              </div>
              <span className="font-bold text-lg text-gradient">Qasir</span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <X key="close" className="h-5 w-5" />
                  ) : (
                    <Menu key="menu" className="h-5 w-5" />
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-background border-l border-border shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-lg text-gradient">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="space-y-2" aria-label="Mobile">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-border">
                  <Button variant="outline" className="w-full justify-start" onClick={toggleTheme}>
                    {isDark ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" aria-hidden="true" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" aria-hidden="true" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
