import OpenAI from "openai";

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

export type RunStatus = "success" | "failure" | "degraded";

export function getOpenRouterBaseUrl(): string {
  return process.env.OPENROUTER_BASE_URL?.trim() || DEFAULT_BASE_URL;
}

export function getOpenRouterApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY?.trim() || undefined;
}

export function getPrimaryModel(): string {
  return (
    process.env.LLM_PRIMARY_MODEL?.trim() ||
    "openai/gpt-oss-120b"
  );
}

export function parseFallbackModels(primaryModel: string): string[] {
  const raw = process.env.LLM_OPENROUTER_MODELS?.trim();
  if (!raw) {
    return [primaryModel];
  }

  const models = raw
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  if (models.length === 0) {
    return [primaryModel];
  }

  if (!models.includes(primaryModel)) {
    return [primaryModel, ...models];
  }

  return models;
}

export function createOpenRouterClient(): OpenAI {
  const apiKey = getOpenRouterApiKey() || "";

  return new OpenAI({
    apiKey,
    baseURL: getOpenRouterBaseUrl(),
    defaultHeaders: {
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Qasir Mehmood - AI Digital Twin",
    },
    dangerouslyAllowBrowser: false,
  });
}

export function maskApiKeyLabel(key: string): string {
  if (key.length <= 16) {
    return "••••••••";
  }
  return `${key.slice(0, 12)}…${key.slice(-3)}`;
}

export function resolveRunStatus(
  actualModel: string | undefined,
  primaryModel: string,
  failed: boolean,
): RunStatus {
  if (failed) {
    return "failure";
  }

  if (!actualModel) {
    return "success";
  }

  if (actualModel.toLowerCase() === primaryModel.toLowerCase()) {
    return "success";
  }

  return "degraded";
}
