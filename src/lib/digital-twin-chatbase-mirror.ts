import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import {
  getChatbaseMonthlyBudget,
  getMonthKey,
  isMirrorBudgetExhausted,
  normalizeMirrorSnapshot,
  type ChatbaseMirrorSnapshot,
} from "@/lib/digital-twin-provider";

export const CHATBASE_MIRROR_COOKIE_NAME = "dt_chatbase_global";

type MirrorPayload = {
  count: number;
  month: string;
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 35;

function getMirrorSecret(): string {
  return (
    process.env.DIGITAL_TWIN_QUOTA_SECRET ||
    process.env.OPENROUTER_API_KEY ||
    "digital-twin-quota-dev-secret"
  );
}

function signPayload(encoded: string): string {
  return createHmac("sha256", getMirrorSecret()).update(encoded).digest("base64url");
}

function encodeSignedCookie(payload: MirrorPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

function decodeSignedCookie(value: string | undefined): MirrorPayload | null {
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
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as MirrorPayload;
  } catch {
    return null;
  }
}

export function readMirrorPayload(
  request: NextRequest,
  month = getMonthKey(),
): MirrorPayload {
  const parsed = decodeSignedCookie(
    request.cookies.get(CHATBASE_MIRROR_COOKIE_NAME)?.value,
  );

  if (!parsed || parsed.month !== month) {
    return { count: 0, month };
  }

  return { count: Math.max(0, parsed.count), month };
}

export function incrementMirrorPayload(
  current: MirrorPayload,
  month = getMonthKey(),
): MirrorPayload {
  if (current.month !== month) {
    return { count: 1, month };
  }
  return { count: current.count + 1, month };
}

export function toMirrorSnapshot(
  payload: MirrorPayload,
  budget = getChatbaseMonthlyBudget(),
): ChatbaseMirrorSnapshot {
  return normalizeMirrorSnapshot({
    used: payload.count,
    budget,
    month: payload.month,
  });
}

export function applyMirrorCookie(
  response: NextResponse,
  payload: MirrorPayload,
): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `${CHATBASE_MIRROR_COOKIE_NAME}=${encodeSignedCookie(payload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`,
  );
}

export function buildMirrorStatus(
  request: NextRequest,
): {
  mirror: ChatbaseMirrorSnapshot;
  shouldUseOpenRouter: boolean;
} {
  const payload = readMirrorPayload(request);
  const mirror = toMirrorSnapshot(payload);
  return {
    mirror,
    shouldUseOpenRouter: isMirrorBudgetExhausted(mirror),
  };
}
