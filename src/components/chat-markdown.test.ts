import { describe, expect, it } from "vitest";
import { sanitizeAssistantContent } from "@/components/chat-markdown";

describe("sanitizeAssistantContent", () => {
  it("removes thinking blocks from assistant output", () => {
    const input = `<thinking>internal reasoning</thinking>

Visible answer with **bold** text.`;

    expect(sanitizeAssistantContent(input)).toBe(
      "Visible answer with **bold** text.",
    );
  });
});
