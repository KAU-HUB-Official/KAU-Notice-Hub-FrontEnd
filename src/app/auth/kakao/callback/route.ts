import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  clearOAuthCookies,
  kakaoRedirectUri,
  safeNextPath,
  setSessionCookie
} from "@/server/auth/session";
import { noticeService } from "@/server/notices";
import { BackendApiError } from "@/server/notices/backend-notice-service";

export const dynamic = "force-dynamic";

function sameState(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

// 카카오 콘솔에 등록한 Redirect URI. state를 확인하고, 인가 code를 백엔드에 넘겨
// 자체 토큰을 받은 뒤 httpOnly 쿠키에 저장하고 원래 페이지로 돌려보낸다.
// 실패하면 원래 페이지에 ?login=failed 를 붙여 돌려보낸다(원인은 서버 로그에만).
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeNextPath(request.cookies.get(OAUTH_NEXT_COOKIE)?.value);
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const state = params.get("state");
  const code = params.get("code");

  function finish(result: "ok" | "failed" | "cancelled", session?: { token: string; maxAge: number }) {
    const target = new URL(next, request.nextUrl.origin);
    if (result !== "ok") {
      target.searchParams.set("login", result);
    }
    const response = NextResponse.redirect(target);
    clearOAuthCookies(response);
    if (session) {
      setSessionCookie(response, session.token, session.maxAge);
    }
    return response;
  }

  if (!expectedState || !state || !sameState(state, expectedState)) {
    console.warn("GET /auth/kakao/callback: state mismatch");
    return finish("failed");
  }

  // 사용자가 카카오 동의 화면에서 취소하면 code 대신 error가 온다.
  if (params.get("error") || !code) {
    return finish("cancelled");
  }

  try {
    const result = await noticeService.loginWithKakao(code, kakaoRedirectUri());
    return finish("ok", { token: result.accessToken, maxAge: result.expiresIn });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : "unknown";
    console.error(`GET /auth/kakao/callback: backend login failed (status=${status})`);
    return finish("failed");
  }
}
