import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getOpenRouterApiKey,
  getOpenRouterBaseUrl,
  maskApiKeyLabel,
} from "@/lib/openrouter";

const CACHE_TTL_MS = 45_000;

const openRouterKeySchema = z.object({
  data: z
    .object({
      label: z.string().optional(),
      usage: z.number().optional(),
      usage_monthly: z.number().optional(),
      usage_daily: z.number().optional(),
      limit_remaining: z.number().nullable().optional(),
    })
    .optional(),
});

type CachedAccountResponse = {
  expiresAt: number;
  payload: {
    label: string;
    usage: number;
    usageMonthly: number;
    usageDaily: number;
    limitRemaining: number | null;
  };
};

let accountCache: CachedAccountResponse | null = null;

export async function GET() {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenRouter API key is not configured" },
      { status: 503 },
    );
  }

  const now = Date.now();
  if (accountCache && accountCache.expiresAt > now) {
    return NextResponse.json(accountCache.payload, {
      headers: { "Cache-Control": "private, max-age=30" },
    });
  }

  try {
    const response = await fetch(`${getOpenRouterBaseUrl()}/key`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch OpenRouter account usage" },
        { status: response.status === 401 ? 503 : 502 },
      );
    }

    const json = await response.json();
    const parsed = openRouterKeySchema.safeParse(json);

    if (!parsed.success || !parsed.data.data) {
      return NextResponse.json(
        { error: "Unexpected OpenRouter account response" },
        { status: 502 },
      );
    }

    const { data } = parsed.data;
    const payload = {
      label: data.label || maskApiKeyLabel(apiKey),
      usage: data.usage ?? 0,
      usageMonthly: data.usage_monthly ?? 0,
      usageDaily: data.usage_daily ?? 0,
      limitRemaining:
        typeof data.limit_remaining === "number" ? data.limit_remaining : null,
    };

    accountCache = {
      expiresAt: now + CACHE_TTL_MS,
      payload,
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, max-age=30" },
    });
  } catch (error) {
    console.error("OpenRouter account usage error:", error);
    return NextResponse.json(
      { error: "Failed to load OpenRouter account usage" },
      { status: 500 },
    );
  }
}
