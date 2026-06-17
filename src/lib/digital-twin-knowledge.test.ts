import { describe, expect, it } from "vitest";
import {
  buildDigitalTwinSystemPrompt,
  GITHUB_REPOS,
  DIGITAL_TWIN_LINKS,
} from "@/lib/digital-twin-knowledge";

describe("digital-twin-knowledge", () => {
  it("includes key GitHub repos in the system prompt", () => {
    const prompt = buildDigitalTwinSystemPrompt();

    expect(prompt).toContain("job-discovery");
    expect(prompt).toContain("daily-briefing");
    expect(prompt).toContain("qasir-profile-ai");
    expect(prompt).toContain(DIGITAL_TWIN_LINKS.linkedin);
  });

  it("enforces concise grounded response rules", () => {
    const prompt = buildDigitalTwinSystemPrompt();

    expect(prompt).toContain("80–150 words");
    expect(prompt).toContain("cite the relevant public GitHub repo");
    expect(prompt).toContain("Do NOT invent employers");
  });

  it("maps data fetching to specific repos", () => {
    const jobDiscovery = GITHUB_REPOS.find((repo) => repo.name === "job-discovery");
    const profile = GITHUB_REPOS.find((repo) => repo.name === "qasir-profile-ai");

    expect(jobDiscovery?.dataFetching).toContain("TanStack Query");
    expect(profile?.dataFetching).toContain("SSE");
  });
});
