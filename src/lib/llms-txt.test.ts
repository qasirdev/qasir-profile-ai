import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "@/lib/llms-txt";

describe("buildLlmsTxt", () => {
  it("follows llmstxt.org structure with required sections and absolute URLs", () => {
    const text = buildLlmsTxt();

    expect(text.startsWith("# Qasir Mehmood\n")).toBe(true);
    expect(text).toMatch(/^> .+/m);
    expect(text).toContain("## Primary");
    expect(text).toContain("## Optional");
    expect(text).toContain("[Plain-text resume](https://www.qasir.co.uk/resume.txt)");
    expect(text).toContain("[Sitemap](https://www.qasir.co.uk/sitemap.xml)");
    expect(text).not.toContain("](/");
  });
});
