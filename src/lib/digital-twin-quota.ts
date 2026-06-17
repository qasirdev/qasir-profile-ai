import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const VISIT_COOKIE_NAME = "dt_visit";
export const DAY_COOKIE_NAME = "dt_day";

export type QuotaLimits = {
  visitLimit: number;
  dayLimit: number;
  maxHistoryTurns: number;
};

export type QuotaSnapshot = {
  visitUsed: number;
  visitLimit: number;
  dayUsed: number;
  dayLimit: number;
};

export type QuotaCheckResult =
  | (QuotaSnapshot & { allowed: true })
  | (QuotaSnapshot & { allowed: false; reason: "visit" | "day" });

type VisitPayload = {
  count: number;
  sessionId: string;
};

type DayPayload = {
  count: number;
  date: string;
};

type ChatMessage = { role: string; content: string };

const COOKIE_MAX_AGE_VISIT = 60 * 60 * 24;
const COOKIE_MAX_AGE_DAY = 60 * 60 * 24;

function getQuotaSecret(): string {
  return (
    process.env.DIGITAL_TWIN_QUOTA_SECRET ||
    process.env.OPENROUTER_API_KEY ||
    "digital-twin-quota-dev-secret"
  );
}

function parseEnvLimit(name: string): number {
  const raw = process.env[name]?.trim();
  if (!raw) return 0;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function getQuotaLimits(): QuotaLimits {
  return {
    visitLimit: parseEnvLimit("DIGITAL_TWIN_MAX_QUESTIONS_PER_VISIT"),
    dayLimit: parseEnvLimit("DIGITAL_TWIN_MAX_QUESTIONS_PER_DAY"),
    maxHistoryTurns: parseEnvLimit("DIGITAL_TWIN_MAX_HISTORY_TURNS") || 6,
  };
}

export function getTodayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function signPayload(encoded: string): string {
  return createHmac("sha256", getQuotaSecret()).update(encoded).digest("base64url");
}

function encodeSignedCookie(payload: VisitPayload | DayPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

function decodeSignedCookie<T>(value: string | undefined): T | null {
  if (!value) return null;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = signPayload(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function createSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readVisitPayload(request: NextRequest): VisitPayload {
  const parsed = decodeSignedCookie<VisitPayload>(
    request.cookies.get(VISIT_COOKIE_NAME)?.value,
  );
  if (!parsed || typeof parsed.count !== "number" || !parsed.sessionId) {
    return { count: 0, sessionId: createSessionId() };
  }
  return { count: Math.max(0, parsed.count), sessionId: parsed.sessionId };
}

export function readDayPayload(request: NextRequest, today = getTodayKey()): DayPayload {
  const parsed = decodeSignedCookie<DayPayload>(
    request.cookies.get(DAY_COOKIE_NAME)?.value,
  );
  if (!parsed || parsed.date !== today) {
    return { count: 0, date: today };
  }
  return { count: Math.max(0, parsed.count), date: today };
}

export function buildQuotaSnapshot(
  visit: VisitPayload,
  day: DayPayload,
  limits = getQuotaLimits(),
): QuotaSnapshot {
  return {
    visitUsed: visit.count,
    visitLimit: limits.visitLimit,
    dayUsed: day.count,
    dayLimit: limits.dayLimit,
  };
}

export function checkQuota(
  visit: VisitPayload,
  day: DayPayload,
  limits = getQuotaLimits(),
): QuotaCheckResult {
  const snapshot = buildQuotaSnapshot(visit, day, limits);

  if (limits.visitLimit > 0 && visit.count >= limits.visitLimit) {
    return { ...snapshot, allowed: false, reason: "visit" };
  }

  if (limits.dayLimit > 0 && day.count >= limits.dayLimit) {
    return { ...snapshot, allowed: false, reason: "day" };
  }

  return { ...snapshot, allowed: true };
}

export function incrementQuota(
  visit: VisitPayload,
  day: DayPayload,
): { visit: VisitPayload; day: DayPayload } {
  return {
    visit: { ...visit, count: visit.count + 1 },
    day: { ...day, count: day.count + 1, date: getTodayKey() },
  };
}

export function resetVisitQuota(request: NextRequest): VisitPayload {
  const current = readVisitPayload(request);
  return { count: 0, sessionId: current.sessionId };
}

export function resetVisitSession(): VisitPayload {
  return { count: 0, sessionId: createSessionId() };
}

export function applyQuotaCookies(
  response: NextResponse,
  visit: VisitPayload,
  day: DayPayload,
): void {
  for (const header of formatQuotaSetCookieHeaders(visit, day)) {
    response.headers.append("Set-Cookie", header);
  }
}

export function formatQuotaSetCookieHeaders(
  visit: VisitPayload,
  day: DayPayload,
): string[] {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return [
    `${VISIT_COOKIE_NAME}=${encodeSignedCookie(visit)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE_VISIT}${secure}`,
    `${DAY_COOKIE_NAME}=${encodeSignedCookie(day)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE_DAY}${secure}`,
  ];
}

export function trimConversationHistory<T extends ChatMessage>(
  messages: T[],
  maxTurns: number,
): T[] {
  if (maxTurns <= 0 || messages.length === 0) {
    return messages;
  }

  const pairs: T[][] = [];
  let buffer: T[] = [];

  for (const message of messages) {
    buffer.push(message);
    if (message.role === "assistant") {
      pairs.push(buffer);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    pairs.push(buffer);
  }

  const recentPairs = pairs.slice(-maxTurns);
  return recentPairs.flat();
}

export function quotaExceededMessage(reason: "visit" | "day"): string {
  if (reason === "visit") {
    return "You've reached the question limit for this visit. Clear chat to start a new visit, or try again tomorrow if you've also hit the daily limit.";
  }
  return "You've reached today's question limit. Please try again tomorrow, or clear chat if you still have visit allowance.";
}
