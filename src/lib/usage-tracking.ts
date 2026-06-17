export const USAGE_STORAGE_KEY = "qasir-digital-twin-usage";

export type UsageTracking = {
  cumulativeCostUsd: number;
  cumulativeRuns: number;
};

export type RunMetadata = {
  latencyMs: number;
  tokens: number;
  costUsd: number;
  model: string;
  status: "success" | "failure" | "degraded";
};

export type AccountUsage = {
  label: string;
  usage: number;
  usageMonthly: number;
  usageDaily: number;
  limitRemaining: number | null;
};

export type QuotaSnapshot = {
  visitUsed: number;
  visitLimit: number;
  dayUsed: number;
  dayLimit: number;
};

export type QuestionLimitError = {
  error: "question_limit_reached";
  reason: "visit" | "day";
  visitUsed: number;
  visitLimit: number;
  dayUsed: number;
  dayLimit: number;
};

const EMPTY_USAGE: UsageTracking = {
  cumulativeCostUsd: 0,
  cumulativeRuns: 0,
};

export function formatCostUsd(cost: number): string {
  if (cost === 0) return "$0";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

export function formatAvgCostPerRun(costUsd: number, runs: number): string {
  if (runs <= 0) {
    return "~$0/run";
  }
  return `~${formatCostUsd(costUsd / runs)}/run`;
}

export function truncateModel(model: string, maxLength = 28): string {
  if (model.length <= maxLength) {
    return model;
  }
  return `${model.slice(0, maxLength)}…`;
}

export function readUsageTracking(): UsageTracking {
  if (typeof window === "undefined") {
    return { ...EMPTY_USAGE };
  }

  try {
    const raw = window.localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_USAGE };
    }

    const parsed = JSON.parse(raw) as Partial<UsageTracking>;
    return {
      cumulativeCostUsd: Number(parsed.cumulativeCostUsd ?? 0),
      cumulativeRuns: Number(parsed.cumulativeRuns ?? 0),
    };
  } catch {
    return { ...EMPTY_USAGE };
  }
}

export function writeUsageTracking(tracking: UsageTracking): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(tracking));
}

export function recordSuccessfulRun(costUsd: number): UsageTracking {
  const current = readUsageTracking();
  const next: UsageTracking = {
    cumulativeRuns: current.cumulativeRuns + 1,
    cumulativeCostUsd: current.cumulativeCostUsd + costUsd,
  };
  writeUsageTracking(next);
  return next;
}

export function getVisitUsage(
  lifetime: UsageTracking,
  baseline: UsageTracking,
): VisitUsageSnapshot {
  return {
    runs: Math.max(0, lifetime.cumulativeRuns - baseline.cumulativeRuns),
    costUsd: Math.max(0, lifetime.cumulativeCostUsd - baseline.cumulativeCostUsd),
  };
}

export type VisitUsageSnapshot = {
  runs: number;
  costUsd: number;
};

export function formatQuotaBanner(snapshot: QuotaSnapshot): string | null {
  if (snapshot.visitLimit === 0 && snapshot.dayLimit === 0) {
    return null;
  }

  const parts: string[] = [];

  if (snapshot.visitLimit > 0) {
    parts.push(`${snapshot.visitUsed}/${snapshot.visitLimit} questions this visit`);
  }

  if (snapshot.dayLimit > 0) {
    parts.push(`${snapshot.dayUsed}/${snapshot.dayLimit} today`);
  }

  return parts.join(" · ");
}

export function isQuotaExceeded(snapshot: QuotaSnapshot): boolean {
  if (snapshot.visitLimit > 0 && snapshot.visitUsed >= snapshot.visitLimit) {
    return true;
  }
  if (snapshot.dayLimit > 0 && snapshot.dayUsed >= snapshot.dayLimit) {
    return true;
  }
  return false;
}

export function quotaExceededMessage(reason: "visit" | "day"): string {
  if (reason === "visit") {
    return "You've reached the question limit for this visit. Clear chat to start a new visit, or try again tomorrow if you've also hit the daily limit.";
  }
  return "You've reached today's question limit. Please try again tomorrow, or clear chat if you still have visit allowance.";
}

export async function fetchQuotaSnapshot(): Promise<QuotaSnapshot | null> {
  try {
    const response = await fetch("/api/usage/quota", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as QuotaSnapshot;
  } catch {
    return null;
  }
}

export async function resetVisitQuotaOnServer(): Promise<QuotaSnapshot | null> {
  try {
    const response = await fetch("/api/usage/quota/reset-visit", {
      method: "POST",
    });
    if (!response.ok) {
      return null;
    }
    await response.json();
    return fetchQuotaSnapshot();
  } catch {
    return null;
  }
}
