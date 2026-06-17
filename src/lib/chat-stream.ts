import type { QuotaSnapshot, RunMetadata } from "@/lib/usage-tracking";

type StreamEvent =
  | { type: "content"; content: string }
  | { type: "metadata"; metadata: RunMetadata; quota: QuotaSnapshot | null }
  | { type: "done" };

function parseStreamEvent(payload: string): StreamEvent | null {
  if (payload === "[DONE]") {
    return { type: "done" };
  }

  try {
    const parsed = JSON.parse(payload) as {
      content?: string;
      type?: string;
      metadata?: RunMetadata;
      quota?: QuotaSnapshot;
    };

    if (parsed.type === "run_metadata" && parsed.metadata) {
      return {
        type: "metadata",
        metadata: parsed.metadata,
        quota: parsed.quota ?? null,
      };
    }

    if (parsed.content) {
      return { type: "content", content: parsed.content };
    }
  } catch {
    return null;
  }

  return null;
}

export type ChatStreamResult = {
  content: string;
  metadata: RunMetadata | null;
  quota: QuotaSnapshot | null;
};

export async function consumeChatStream(
  body: ReadableStream<Uint8Array> | null,
  onContent?: (content: string) => void,
): Promise<ChatStreamResult> {
  if (!body) {
    throw new Error("No response body");
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let metadata: RunMetadata | null = null;
  let quota: QuotaSnapshot | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) {
        continue;
      }

      const event = parseStreamEvent(line.slice(6));
      if (!event) {
        continue;
      }

      if (event.type === "content") {
        content += event.content;
        onContent?.(content);
      }

      if (event.type === "metadata") {
        metadata = event.metadata;
        quota = event.quota;
      }
    }
  }

  return { content, metadata, quota };
}
