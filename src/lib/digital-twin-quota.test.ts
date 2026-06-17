import { describe, expect, it, beforeEach, vi } from "vitest";
import type { NextRequest } from "next/server";
import {
  checkQuota,
  formatQuotaSetCookieHeaders,
  getQuotaLimits,
  getTodayKey,
  incrementQuota,
  readDayPayload,
  readVisitPayload,
  resetVisitQuota,
  resetVisitSession,
  trimConversationHistory,
  VISIT_COOKIE_NAME,
  DAY_COOKIE_NAME,
} from "@/lib/digital-twin-quota";

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

function extractCookieValue(setCookieHeader: string): string {
  const [pair] = setCookieHeader.split(";");
  const [, value] = pair.split("=");
  return value;
}

describe("getQuotaLimits", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("treats 0 env values as unlimited", () => {
    vi.stubEnv("DIGITAL_TWIN_MAX_QUESTIONS_PER_VISIT", "0");
    vi.stubEnv("DIGITAL_TWIN_MAX_QUESTIONS_PER_DAY", "0");
    vi.stubEnv("DIGITAL_TWIN_MAX_HISTORY_TURNS", "0");

    expect(getQuotaLimits()).toEqual({
      visitLimit: 0,
      dayLimit: 0,
      maxHistoryTurns: 6,
    });
  });

  it("parses positive limits from env", () => {
    vi.stubEnv("DIGITAL_TWIN_MAX_QUESTIONS_PER_VISIT", "5");
    vi.stubEnv("DIGITAL_TWIN_MAX_QUESTIONS_PER_DAY", "20");
    vi.stubEnv("DIGITAL_TWIN_MAX_HISTORY_TURNS", "8");

    expect(getQuotaLimits()).toEqual({
      visitLimit: 5,
      dayLimit: 20,
      maxHistoryTurns: 8,
    });
  });
});

describe("checkQuota", () => {
  const limits = { visitLimit: 3, dayLimit: 5, maxHistoryTurns: 6 };

  it("allows requests under both limits", () => {
    const result = checkQuota(
      { count: 2, sessionId: "s1" },
      { count: 4, date: "2026-06-17" },
      limits,
    );

    expect(result).toMatchObject({
      allowed: true,
      visitUsed: 2,
      visitLimit: 3,
      dayUsed: 4,
      dayLimit: 5,
    });
  });

  it("blocks when visit limit is reached", () => {
    const result = checkQuota(
      { count: 3, sessionId: "s1" },
      { count: 1, date: "2026-06-17" },
      limits,
    );

    expect(result).toEqual({
      allowed: false,
      reason: "visit",
      visitUsed: 3,
      visitLimit: 3,
      dayUsed: 1,
      dayLimit: 5,
    });
  });

  it("blocks when day limit is reached", () => {
    const result = checkQuota(
      { count: 1, sessionId: "s1" },
      { count: 5, date: "2026-06-17" },
      limits,
    );

    expect(result).toEqual({
      allowed: false,
      reason: "day",
      visitUsed: 1,
      visitLimit: 3,
      dayUsed: 5,
      dayLimit: 5,
    });
  });

  it("allows unlimited when limits are 0", () => {
    const unlimited = { visitLimit: 0, dayLimit: 0, maxHistoryTurns: 6 };
    const result = checkQuota(
      { count: 999, sessionId: "s1" },
      { count: 999, date: "2026-06-17" },
      unlimited,
    );

    expect(result.allowed).toBe(true);
  });
});

describe("incrementQuota", () => {
  it("increments visit and day counters together", () => {
    const visit = { count: 2, sessionId: "s1" };
    const day = { count: 4, date: "2026-06-17" };

    expect(incrementQuota(visit, day)).toEqual({
      visit: { count: 3, sessionId: "s1" },
      day: { count: 5, date: getTodayKey() },
    });
  });
});

describe("readDayPayload", () => {
  it("resets day count when the date changes", () => {
    const headers = formatQuotaSetCookieHeaders(
      { count: 2, sessionId: "s1" },
      { count: 4, date: "2026-06-16" },
    );
    const dayCookie = extractCookieValue(
      headers.find((h) => h.startsWith(`${DAY_COOKIE_NAME}=`))!,
    );

    const request = mockRequest({ [DAY_COOKIE_NAME]: dayCookie });
    const today = readDayPayload(request, "2026-06-17");

    expect(today).toEqual({ count: 0, date: "2026-06-17" });
  });

  it("keeps day count for the same date", () => {
    const headers = formatQuotaSetCookieHeaders(
      { count: 1, sessionId: "s1" },
      { count: 3, date: "2026-06-17" },
    );
    const dayCookie = extractCookieValue(
      headers.find((h) => h.startsWith(`${DAY_COOKIE_NAME}=`))!,
    );

    const request = mockRequest({ [DAY_COOKIE_NAME]: dayCookie });
    const today = readDayPayload(request, "2026-06-17");

    expect(today).toEqual({ count: 3, date: "2026-06-17" });
  });
});

describe("reset visit quota", () => {
  it("resetVisitQuota clears visit count but keeps session id", () => {
    const headers = formatQuotaSetCookieHeaders(
      { count: 4, sessionId: "session-abc" },
      { count: 2, date: "2026-06-17" },
    );
    const visitCookie = extractCookieValue(
      headers.find((h) => h.startsWith(`${VISIT_COOKIE_NAME}=`))!,
    );

    const request = mockRequest({ [VISIT_COOKIE_NAME]: visitCookie });
    const reset = resetVisitQuota(request);

    expect(reset).toEqual({ count: 0, sessionId: "session-abc" });
  });

  it("resetVisitSession starts a fresh visit with zero count", () => {
    const reset = resetVisitSession();
    expect(reset.count).toBe(0);
    expect(reset.sessionId).toBeTruthy();
  });

  it("readVisitPayload returns zero for missing cookie", () => {
    const visit = readVisitPayload(mockRequest());
    expect(visit.count).toBe(0);
    expect(visit.sessionId).toBeTruthy();
  });
});

describe("trimConversationHistory", () => {
  it("keeps only the most recent user+assistant pairs", () => {
    const messages = [
      { role: "user", content: "q1" },
      { role: "assistant", content: "a1" },
      { role: "user", content: "q2" },
      { role: "assistant", content: "a2" },
      { role: "user", content: "q3" },
      { role: "assistant", content: "a3" },
    ];

    expect(trimConversationHistory(messages, 2)).toEqual([
      { role: "user", content: "q2" },
      { role: "assistant", content: "a2" },
      { role: "user", content: "q3" },
      { role: "assistant", content: "a3" },
    ]);
  });
});
