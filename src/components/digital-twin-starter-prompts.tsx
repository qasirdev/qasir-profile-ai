"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIGITAL_TWIN_STARTER_PROMPTS } from "@/lib/digital-twin-prompts";

type DigitalTwinStarterPromptsProps = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
};

export function DigitalTwinStarterPrompts({
  onSelect,
  disabled = false,
  className,
}: DigitalTwinStarterPromptsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className={cn("mt-2 space-y-3", className)}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
        <span>Try asking:</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {DIGITAL_TWIN_STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt)}
            className="rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Ask: ${prompt}`}
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
