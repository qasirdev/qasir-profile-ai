"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  formatAvgCostPerRun,
  formatCostUsd,
  getVisitUsage,
  readUsageTracking,
  recordSuccessfulRun,
  type AccountUsage,
  type RunMetadata,
  type UsageTracking,
  truncateModel,
} from "@/lib/usage-tracking";

type DigitalTwinObservabilityProps = {
  runMetadata: RunMetadata | null;
  refreshToken?: number;
};

const STATUS_STYLES: Record<RunMetadata["status"], string> = {
  success: "text-emerald-500 dark:text-emerald-400",
  failure: "text-red-500 dark:text-red-400",
  degraded: "text-amber-500 dark:text-amber-400",
};

async function fetchAccountUsage(): Promise<AccountUsage | null> {
  try {
    const response = await fetch("/api/usage/account", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as AccountUsage;
  } catch {
    return null;
  }
}

export function DigitalTwinObservability({
  runMetadata,
  refreshToken = 0,
}: DigitalTwinObservabilityProps) {
  const [lifetime, setLifetime] = useState<UsageTracking>(() => readUsageTracking());
  const [visitBaseline] = useState<UsageTracking>(() => readUsageTracking());
  const [accountUsage, setAccountUsage] = useState<AccountUsage | null>(null);
  const [accountError, setAccountError] = useState(false);
  const recordedRunRef = useRef<string | null>(null);

  const refreshAccount = useCallback(async () => {
    const account = await fetchAccountUsage();
    if (account) {
      setAccountUsage(account);
      setAccountError(false);
      return;
    }
    setAccountError(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void fetchAccountUsage().then((account) => {
      if (cancelled) return;
      if (account) {
        setAccountUsage(account);
        setAccountError(false);
      } else {
        setAccountError(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  useEffect(() => {
    if (!runMetadata || runMetadata.status === "failure") {
      return;
    }

    const runKey = `${runMetadata.latencyMs}:${runMetadata.tokens}:${runMetadata.model}:${runMetadata.costUsd}`;
    if (recordedRunRef.current === runKey) {
      return;
    }
    recordedRunRef.current = runKey;

    const nextLifetime = recordSuccessfulRun(runMetadata.costUsd);
    setLifetime(nextLifetime);
    void refreshAccount();
  }, [runMetadata, refreshAccount]);

  const visit = getVisitUsage(lifetime, visitBaseline);

  if (!runMetadata) {
    return null;
  }

  return (
    <div
      className="mb-4 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground backdrop-blur-sm"
      role="region"
      aria-label="Digital Twin run observability"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono leading-relaxed">
        <span
          title="Wall-clock execution time for this run"
          aria-label={`Execution time ${runMetadata.latencyMs} milliseconds`}
        >
          ⏱ {runMetadata.latencyMs}ms
        </span>
        <span
          title="Total tokens reported by OpenRouter"
          aria-label={`${runMetadata.tokens} tokens used`}
        >
          🧠 {runMetadata.tokens} tokens
        </span>
        <span
          title="Estimated cost for this run"
          aria-label={`Cost ${formatCostUsd(runMetadata.costUsd)}`}
        >
          💰 {formatCostUsd(runMetadata.costUsd)}
        </span>
        <span
          title={`Model: ${runMetadata.model}`}
          aria-label={`Model ${runMetadata.model}`}
        >
          🤖 {truncateModel(runMetadata.model)}
        </span>
        <span
          className={cn("font-semibold capitalize", STATUS_STYLES[runMetadata.status])}
          title={`Run status: ${runMetadata.status}`}
          aria-label={`Status ${runMetadata.status}`}
        >
          {runMetadata.status}
        </span>
      </div>

      <p className="mt-1.5 leading-relaxed">
        This visit: {visit.runs} runs · {formatCostUsd(visit.costUsd)} (
        {formatAvgCostPerRun(visit.costUsd, visit.runs)}) · Lifetime (this browser):{" "}
        {lifetime.cumulativeRuns} runs · {formatCostUsd(lifetime.cumulativeCostUsd)} (
        {formatAvgCostPerRun(
          lifetime.cumulativeCostUsd,
          lifetime.cumulativeRuns,
        )}{" "}
        avg)
      </p>

      {accountUsage ? (
        <p className="mt-1 leading-relaxed">
          OpenRouter account ({accountUsage.label}): all-time{" "}
          {formatCostUsd(accountUsage.usage)} · this month{" "}
          {formatCostUsd(accountUsage.usageMonthly)} · today{" "}
          {formatCostUsd(accountUsage.usageDaily)}
          {accountUsage.limitRemaining !== null
            ? ` · ${formatCostUsd(accountUsage.limitRemaining)} remaining`
            : ""}
        </p>
      ) : accountError ? (
        <p className="mt-1 text-muted-foreground/80">
          OpenRouter account usage unavailable.
        </p>
      ) : null}
    </div>
  );
}
