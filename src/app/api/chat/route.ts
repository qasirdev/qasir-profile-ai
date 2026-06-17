import { NextRequest, NextResponse } from "next/server";
import type {
  ChatCompletionChunk,
  ChatCompletionCreateParamsStreaming,
} from "openai/resources/chat/completions";
import {
  createOpenRouterClient,
  getOpenRouterApiKey,
  getPrimaryModel,
  parseFallbackModels,
  resolveRunStatus,
} from "@/lib/openrouter";
import {
  checkQuota,
  formatQuotaSetCookieHeaders,
  getQuotaLimits,
  incrementQuota,
  readDayPayload,
  readVisitPayload,
  trimConversationHistory,
} from "@/lib/digital-twin-quota";
import type { RunMetadata } from "@/lib/usage-tracking";
import { buildDigitalTwinSystemPrompt } from "@/lib/digital-twin-knowledge";

const SYSTEM_PROMPT = buildDigitalTwinSystemPrompt();

type OpenRouterChatParams = ChatCompletionCreateParamsStreaming & {
  models: string[];
  route: "fallback";
};

type OpenRouterUsage = {
  total_tokens?: number;
  cost?: number;
};

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function buildChatCompletionParams(
  primaryModel: string,
  messages: ChatCompletionCreateParamsStreaming["messages"],
  fallbackModels: string[],
): OpenRouterChatParams {
  return {
    model: primaryModel,
    messages,
    stream: true,
    stream_options: { include_usage: true },
    max_tokens: 500,
    temperature: 0.7,
    models: fallbackModels,
    route: "fallback",
  };
}

function encodeSse(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

function extractUsage(chunk: ChatCompletionChunk): OpenRouterUsage | undefined {
  const usage = chunk.usage as OpenRouterUsage | undefined;
  return usage;
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const primaryModel = getPrimaryModel();
  const limits = getQuotaLimits();

  try {
    if (!getOpenRouterApiKey()) {
      console.error("OPENROUTER_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "OpenRouter API key is not configured" },
        { status: 500 },
      );
    }

    const { messages } = (await request.json()) as { messages?: IncomingMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const visit = readVisitPayload(request);
    const day = readDayPayload(request);
    const quotaCheck = checkQuota(visit, day, limits);

    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: "question_limit_reached",
          reason: quotaCheck.reason,
          visitUsed: quotaCheck.visitUsed,
          visitLimit: quotaCheck.visitLimit,
          dayUsed: quotaCheck.dayUsed,
          dayLimit: quotaCheck.dayLimit,
        },
        { status: 429 },
      );
    }

    const trimmedMessages = trimConversationHistory(messages, limits.maxHistoryTurns);
    const nextQuota = incrementQuota(visit, day);

    const conversationMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...trimmedMessages,
    ];

    const openai = createOpenRouterClient();
    const fallbackModels = parseFallbackModels(primaryModel);
    const requestBody = buildChatCompletionParams(
      primaryModel,
      conversationMessages,
      fallbackModels,
    );

    const response = await openai.chat.completions.create(requestBody);

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    for (const cookieHeader of formatQuotaSetCookieHeaders(
      nextQuota.visit,
      nextQuota.day,
    )) {
      headers.append("Set-Cookie", cookieHeader);
    }

    const stream = new ReadableStream({
      async start(controller) {
        let responseModel = primaryModel;
        let totalTokens = 0;
        let costUsd = 0;

        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (chunk.model) {
              responseModel = chunk.model;
            }

            const usage = extractUsage(chunk);
            if (usage) {
              totalTokens = usage.total_tokens ?? totalTokens;
              costUsd = usage.cost ?? costUsd;
            }

            if (content) {
              controller.enqueue(encodeSse({ content }));
            }
          }

          const metadata: RunMetadata = {
            latencyMs: Date.now() - startedAt,
            tokens: totalTokens,
            costUsd,
            model: responseModel,
            status: resolveRunStatus(responseModel, primaryModel, false),
          };

          controller.enqueue(
            encodeSse({
              type: "run_metadata",
              metadata,
              quota: {
                visitUsed: nextQuota.visit.count,
                visitLimit: limits.visitLimit,
                dayUsed: nextQuota.day.count,
                dayLimit: limits.dayLimit,
              },
            }),
          );
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);

          const metadata: RunMetadata = {
            latencyMs: Date.now() - startedAt,
            tokens: totalTokens,
            costUsd,
            model: responseModel,
            status: "failure",
          };

          controller.enqueue(
            encodeSse({
              type: "run_metadata",
              metadata,
            }),
          );
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error("Chat API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown",
    });

    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
