import { NextResponse } from "next/server";

import { clearSessionCookie, withAccessToken } from "@/server/auth/session";
import { noticeService } from "@/server/notices";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAccessToken("GET /api/me", "사용자 정보를 확인하지 못했습니다.", async (token) =>
    NextResponse.json(await noticeService.getMe(token))
  );
}

// 회원 탈퇴. 백엔드가 사용자와 북마크를 함께 지우고, 여기서 로그인 쿠키를 지운다.
export async function DELETE() {
  return withAccessToken("DELETE /api/me", "회원 탈퇴를 처리하지 못했습니다.", async (token) => {
    await noticeService.deleteMe(token);
    const response = new NextResponse(null, { status: 204 });
    clearSessionCookie(response);
    return response;
  });
}
