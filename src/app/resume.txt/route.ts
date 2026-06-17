import { fetchResumeText, RESUME_REVALIDATE_SECONDS } from "@/lib/fetch-resume";

export async function GET() {
  const text = await fetchResumeText();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, max-age=${RESUME_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
}
