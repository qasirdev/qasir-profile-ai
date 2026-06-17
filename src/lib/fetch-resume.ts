import { PROFILE_DATA } from "@/lib/constants";
import { RESUME_PLAIN_TEXT_FALLBACK } from "@/lib/resume-content";

/** Revalidate remote CV text every hour — update GitHub file without redeploying the site */
export const RESUME_REVALIDATE_SECONDS = 3600;

export async function fetchResumeText(): Promise<string> {
  try {
    const response = await fetch(PROFILE_DATA.resumeTextUrl, {
      next: { revalidate: RESUME_REVALIDATE_SECONDS },
      headers: { Accept: "text/plain, text/markdown, */*" },
    });

    if (!response.ok) {
      throw new Error(`Resume fetch failed: ${response.status}`);
    }

    const text = (await response.text()).trim();
    if (!text) {
      throw new Error("Resume fetch returned empty content");
    }

    return text;
  } catch {
    return RESUME_PLAIN_TEXT_FALLBACK;
  }
}
