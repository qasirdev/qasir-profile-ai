import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  formatAvgCostPerRun,
  formatCostUsd,
  getVisitUsage,
  readUsageTracking,
  recordSuccessfulRun,
  truncateModel,
  USAGE_STORAGE_KEY,
} from "@/lib/usage-tracking";
import {
  maskApiKeyLabel,
  parseFallbackModels,
  resolveRunStatus,
} from "@/lib/openrouter";

describe("formatCostUsd", () => {
  it("formats zero and sub-cent values", () => {
    expect(formatCostUsd(0)).toBe("$0");
    expect(formatCostUsd(0.0046)).toBe("$0.0046");
  });

  it("formats larger values with fewer decimals", () => {
    expect(formatCostUsd(0.567)).toBe("$0.567");
    expect(formatCostUsd(4.43)).toBe("$4.43");
  });
});

describe("usage tracking", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("records successful runs in localStorage", () => {
    const first = recordSuccessfulRun(0.0046);
    const second = recordSuccessfulRun(0.0021);

    expect(first.cumulativeRuns).toBe(1);
    expect(second.cumulativeRuns).toBe(2);
    expect(second.cumulativeCostUsd).toBeCloseTo(0.0067, 4);
    expect(readUsageTracking()).toEqual(second);
  });

  it("computes visit usage from baseline", () => {
    window.localStorage.setItem(
      USAGE_STORAGE_KEY,
      JSON.stringify({ cumulativeRuns: 10, cumulativeCostUsd: 0.05 }),
    );

    const lifetime = readUsageTracking();
    const baseline = { cumulativeRuns: 7, cumulativeCostUsd: 0.035 };
    const visit = getVisitUsage(lifetime, baseline);

    expect(visit.runs).toBe(3);
    expect(visit.costUsd).toBeCloseTo(0.015, 4);
    expect(formatAvgCostPerRun(visit.costUsd, visit.runs)).toBe("~$0.0050/run");
  });
});

describe("openrouter helpers", () => {
  it("masks api keys safely", () => {
    expect(maskApiKeyLabel("sk-or-v1-300abc123defc32")).toBe(
      "sk-or-v1-300…c32",
    );
  });

  it("truncates long model names", () => {
    expect(
      truncateModel("deepseek/deepseek-v4-flash-preview-long-name"),
    ).toBe("deepseek/deepseek-v4-flash-p…");
  });

  it("parses fallback models from env", () => {
    vi.stubEnv(
      "LLM_OPENROUTER_MODELS",
      "openai/gpt-oss-120b:free,deepseek/deepseek-v4-flash",
    );

    expect(parseFallbackModels("openai/gpt-oss-120b:free")).toEqual([
      "openai/gpt-oss-120b:free",
      "deepseek/deepseek-v4-flash",
    ]);

    vi.unstubAllEnvs();
  });

  it("marks fallback responses as degraded", () => {
    expect(
      resolveRunStatus("deepseek/deepseek-v4-flash", "openai/gpt-oss-120b:free", false),
    ).toBe("degraded");
    expect(
      resolveRunStatus("openai/gpt-oss-120b:free", "openai/gpt-oss-120b:free", false),
    ).toBe("success");
    expect(resolveRunStatus(undefined, "openai/gpt-oss-120b:free", true)).toBe(
      "failure",
    );
  });
});
