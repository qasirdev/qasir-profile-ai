import { NextRequest, NextResponse } from "next/server";
import {
  applyQuotaCookies,
  readDayPayload,
  resetVisitSession,
} from "@/lib/digital-twin-quota";

export async function POST(request: NextRequest) {
  const day = readDayPayload(request);
  const visit = resetVisitSession();

  const response = NextResponse.json({
    visitUsed: visit.count,
    dayUsed: day.count,
    reset: "visit",
  });

  applyQuotaCookies(response, visit, day);
  return response;
}
