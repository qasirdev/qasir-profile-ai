export type DigitalTwinProvider = "chatbase" | "openrouter";

export type ForceProviderSetting = "auto" | DigitalTwinProvider;

export const DT_PROVIDER_STORAGE_KEY = "dt_provider";

export type ChatbaseMirrorSnapshot = {
  used: number;
  budget: number;
  month: string;
};

export type ProviderConfig = {
  forceProvider: ForceProviderSetting;
  chatbaseEmbedId: string | null;
  chatbaseBudget: number;
};

const EXHAUSTION_PATTERNS = [
  /currently unavailable/i,
  /credit/i,
  /message limit/i,
  /out of.*credits/i,
  /no credits/i,
];

export function getMonthKey(date = new Date()): string {
  return date.toISOString().slice(0, 7);
}

export function getChatbaseEmbedId(): string | null {
  const id = process.env.NEXT_PUBLIC_CHATBASE_EMBED_ID?.trim();
  return id || null;
}

export function getForceProviderSetting(): ForceProviderSetting {
  const raw =
    process.env.NEXT_PUBLIC_DIGITAL_TWIN_FORCE_PROVIDER?.trim() ||
    process.env.DIGITAL_TWIN_FORCE_PROVIDER?.trim() ||
    "auto";

  if (raw === "chatbase" || raw === "openrouter") {
    return raw;
  }
  return "auto";
}

export function getChatbaseMonthlyBudget(): number {
  const raw = process.env.DIGITAL_TWIN_CHATBASE_MONTHLY_BUDGET?.trim();
  if (!raw) return 50;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : 50;
}

export function getProviderConfig(): ProviderConfig {
  return {
    forceProvider: getForceProviderSetting(),
    chatbaseEmbedId: getChatbaseEmbedId(),
    chatbaseBudget: getChatbaseMonthlyBudget(),
  };
}

export function readStoredProvider(): DigitalTwinProvider | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(DT_PROVIDER_STORAGE_KEY);
  if (stored === "chatbase" || stored === "openrouter") {
    return stored;
  }
  return null;
}

export function writeStoredProvider(provider: DigitalTwinProvider): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DT_PROVIDER_STORAGE_KEY, provider);
}

export function resolveProvider(
  config: ProviderConfig,
  storedProvider: DigitalTwinProvider | null,
  mirrorExhausted = false,
): DigitalTwinProvider {
  if (config.forceProvider === "openrouter") {
    return "openrouter";
  }
  if (config.forceProvider === "chatbase" && config.chatbaseEmbedId) {
    return "chatbase";
  }

  if (storedProvider === "openrouter" || mirrorExhausted) {
    return "openrouter";
  }

  if (config.chatbaseEmbedId) {
    return "chatbase";
  }

  return "openrouter";
}

export function isChatbaseExhaustionMessage(content: string): boolean {
  const normalized = content.trim();
  if (!normalized) {
    return false;
  }
  return EXHAUSTION_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isMirrorBudgetExhausted(
  mirror: ChatbaseMirrorSnapshot,
  month = getMonthKey(),
): boolean {
  if (mirror.budget <= 0) {
    return false;
  }
  if (mirror.month !== month) {
    return false;
  }
  return mirror.used >= mirror.budget;
}

export function normalizeMirrorSnapshot(
  snapshot: Partial<ChatbaseMirrorSnapshot>,
  month = getMonthKey(),
): ChatbaseMirrorSnapshot {
  return {
    used: Math.max(0, Number(snapshot.used ?? 0)),
    budget: Math.max(0, Number(snapshot.budget ?? getChatbaseMonthlyBudget())),
    month: snapshot.month ?? month,
  };
}

export async function fetchChatbaseMirror(): Promise<{
  mirror: ChatbaseMirrorSnapshot;
  forceProvider: ForceProviderSetting;
  shouldUseOpenRouter: boolean;
} | null> {
  try {
    const response = await fetch("/api/usage/chatbase-message", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as {
      mirror: ChatbaseMirrorSnapshot;
      forceProvider: ForceProviderSetting;
      shouldUseOpenRouter: boolean;
    };
  } catch {
    return null;
  }
}

export async function recordChatbaseUserMessage(): Promise<{
  mirror: ChatbaseMirrorSnapshot;
  shouldUseOpenRouter: boolean;
} | null> {
  try {
    const response = await fetch("/api/usage/chatbase-message", { method: "POST" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as {
      mirror: ChatbaseMirrorSnapshot;
      shouldUseOpenRouter: boolean;
    };
  } catch {
    return null;
  }
}
