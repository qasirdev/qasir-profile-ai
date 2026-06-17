import { NextRequest, NextResponse } from "next/server";
import {
  buildQuotaSnapshot,
  readDayPayload,
  readVisitPayload,
} from "@/lib/digital-twin-quota";

export async function GET(request: NextRequest) {
  const visit = readVisitPayload(request);
  const day = readDayPayload(request);
  const snapshot = buildQuotaSnapshot(visit, day);

  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store" },
  });
}
