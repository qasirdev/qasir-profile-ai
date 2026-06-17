import { describe, expect, it, beforeEach } from "vitest";
import {
  getMonthKey,
  isChatbaseExhaustionMessage,
  isMirrorBudgetExhausted,
  normalizeMirrorSnapshot,
  readStoredProvider,
  resolveProvider,
  writeStoredProvider,
  DT_PROVIDER_STORAGE_KEY,
  type ProviderConfig,
} from "@/lib/digital-twin-provider";
import {
  incrementMirrorPayload,
  readMirrorPayload,
  toMirrorSnapshot,
} from "@/lib/digital-twin-chatbase-mirror";
import type { NextRequest } from "next/server";

function mockRequest(cookies: Record<string, string> = {}): NextRequest {
  return {
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value ? { name, value } : undefined;
      },
    },
  } as NextRequest;
}

const baseConfig: ProviderConfig = {
  forceProvider: "auto",
  chatbaseEmbedId: "agent-123",
  chatbaseBudget: 50,
};

describe("resolveProvider", () => {
  it("forces openrouter when env override is set", () => {
    expect(
      resolveProvider(
        { ...baseConfig, forceProvider: "openrouter" },
        "chatbase",
        false,
      ),
    ).toBe("openrouter");
  });

  it("forces chatbase when embed id exists and override is chatbase", () => {
    expect(
      resolveProvider(
        { ...baseConfig, forceProvider: "chatbase" },
        "openrouter",
        false,
      ),
    ).toBe("chatbase");
  });

  it("uses stored openrouter after fallback switch", () => {
    expect(resolveProvider(baseConfig, "openrouter", false)).toBe("openrouter");
  });

  it("defaults to chatbase when embed id is configured", () => {
    expect(resolveProvider(baseConfig, null, false)).toBe("chatbase");
  });

  it("defaults to openrouter when chatbase is not configured", () => {
    expect(
      resolveProvider({ ...baseConfig, chatbaseEmbedId: null }, null, false),
    ).toBe("openrouter");
  });

  it("switches to openrouter when mirror budget is exhausted", () => {
    expect(resolveProvider(baseConfig, null, true)).toBe("openrouter");
  });
});

describe("isChatbaseExhaustionMessage", () => {
  it("detects Chatbase unavailable copy", () => {
    expect(
      isChatbaseExhaustionMessage(
        "This AI Agent is currently unavailable. If you are the owner, please check your account.",
      ),
    ).toBe(true);
  });

  it("detects credit exhaustion wording", () => {
    expect(isChatbaseExhaustionMessage("You are out of message credits.")).toBe(
      true,
    );
  });

  it("ignores normal assistant replies", () => {
    expect(
      isChatbaseExhaustionMessage("Qasir led Azure platform engineering at NHS."),
    ).toBe(false);
  });
});

describe("mirror counter helpers", () => {
  it("rolls month forward when incrementing in a new month", () => {
    const current = { count: 40, month: "2026-05" };
    const next = incrementMirrorPayload(current, "2026-06");
    expect(next).toEqual({ count: 1, month: "2026-06" });
  });

  it("increments within the same month", () => {
    const current = { count: 4, month: "2026-06" };
    expect(incrementMirrorPayload(current, "2026-06")).toEqual({
      count: 5,
      month: "2026-06",
    });
  });

  it("resets read count when stored month changes", () => {
    const request = mockRequest();
    const payload = readMirrorPayload(request, "2026-06");
    expect(payload).toEqual({ count: 0, month: "2026-06" });
  });

  it("marks mirror budget as exhausted at threshold", () => {
    const mirror = normalizeMirrorSnapshot({
      used: 50,
      budget: 50,
      month: getMonthKey(),
    });
    expect(isMirrorBudgetExhausted(mirror)).toBe(true);
  });

  it("does not exhaust when budget is disabled", () => {
    const mirror = normalizeMirrorSnapshot({
      used: 999,
      budget: 0,
      month: getMonthKey(),
    });
    expect(isMirrorBudgetExhausted(mirror)).toBe(false);
  });

  it("builds mirror snapshot from payload", () => {
    expect(toMirrorSnapshot({ count: 3, month: "2026-06" }, 50)).toEqual({
      used: 3,
      budget: 50,
      month: "2026-06",
    });
  });
});

describe("stored provider persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("writes and reads provider from localStorage", () => {
    writeStoredProvider("openrouter");
    expect(readStoredProvider()).toBe("openrouter");
    expect(window.localStorage.getItem(DT_PROVIDER_STORAGE_KEY)).toBe("openrouter");
  });
});
