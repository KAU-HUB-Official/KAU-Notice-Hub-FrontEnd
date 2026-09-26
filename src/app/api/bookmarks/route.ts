import { NextRequest, NextResponse } from "next/server";

import { withAccessToken } from "@/server/auth/session";
import { noticeService } from "@/server/notices";

export const dynamic = "force-dynamic";

function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const page = toPositiveInt(request.nextUrl.searchParams.get("page"), 1);
  const pageSize = Math.min(toPositiveInt(request.nextUrl.searchParams.get("pageSize"), 20), 100);
  return withAccessToken("GET /api/bookmarks", "북마크 목록을 불러오지 못했습니다.", async (token) =>
    NextResponse.json(await noticeService.listBookmarks(token, page, pageSize))
  );
}
