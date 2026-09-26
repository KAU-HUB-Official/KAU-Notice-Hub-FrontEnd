import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/server/auth/session";

export const dynamic = "force-dynamic";

// 백엔드에는 로그아웃이 없다(토큰을 서버에 저장하지 않음). 쿠키만 지운다.
export function POST() {
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookie(response);
  return response;
}
