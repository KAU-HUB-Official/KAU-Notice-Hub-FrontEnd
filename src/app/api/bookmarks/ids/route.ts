import { NextResponse } from "next/server";

import { withAccessToken } from "@/server/auth/session";
import { noticeService } from "@/server/notices";

export const dynamic = "force-dynamic";

// 공지 목록·상세에서 북마크 아이콘을 채울지 판단하는 데 쓴다. 로그인하지 않았으면 401.
export async function GET() {
  return withAccessToken("GET /api/bookmarks/ids", "북마크 목록을 불러오지 못했습니다.", async (token) =>
    NextResponse.json({ noticeIds: await noticeService.getBookmarkIds(token) })
  );
}
