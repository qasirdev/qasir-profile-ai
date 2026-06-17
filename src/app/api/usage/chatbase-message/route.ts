import { NextRequest, NextResponse } from "next/server";
import {
  applyMirrorCookie,
  buildMirrorStatus,
  incrementMirrorPayload,
  readMirrorPayload,
  toMirrorSnapshot,
} from "@/lib/digital-twin-chatbase-mirror";
import { getForceProviderSetting } from "@/lib/digital-twin-provider";

export async function GET(request: NextRequest) {
  const forceProvider = getForceProviderSetting();
  const { mirror, shouldUseOpenRouter } = buildMirrorStatus(request);

  return NextResponse.json(
    {
      mirror,
      forceProvider,
      shouldUseOpenRouter:
        forceProvider === "openrouter" ? true : shouldUseOpenRouter,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  const current = readMirrorPayload(request);
  const next = incrementMirrorPayload(current);
  const mirror = toMirrorSnapshot(next);
  const forceProvider = getForceProviderSetting();
  const shouldUseOpenRouter =
    forceProvider === "openrouter" || mirror.used >= mirror.budget;

  const response = NextResponse.json({
    mirror,
    shouldUseOpenRouter,
  });

  applyMirrorCookie(response, next);
  return response;
}
