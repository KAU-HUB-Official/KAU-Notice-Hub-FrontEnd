import { NextResponse } from "next/server";

import { withAccessToken } from "@/server/auth/session";
import { noticeService } from "@/server/notices";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    noticeId: string;
  };
}

// 추가·삭제 모두 멱등이다(백엔드 계약). 추가는 새로 만들면 201, 이미 있으면 200을 백엔드가 주지만
// 프론트는 구분하지 않으므로 200으로 돌려준다.
export async function PUT(_: Request, context: RouteContext) {
  const noticeId = decodeURIComponent(context.params.noticeId);
  return withAccessToken("PUT /api/bookmarks/[noticeId]", "북마크를 저장하지 못했습니다.", async (token) =>
    NextResponse.json(await noticeService.addBookmark(token, noticeId))
  );
}

export async function DELETE(_: Request, context: RouteContext) {
  const noticeId = decodeURIComponent(context.params.noticeId);
  return withAccessToken("DELETE /api/bookmarks/[noticeId]", "북마크를 삭제하지 못했습니다.", async (token) => {
    await noticeService.removeBookmark(token, noticeId);
    return new NextResponse(null, { status: 204 });
  });
}
