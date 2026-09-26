import { randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { kakaoRedirectUri, kakaoRestApiKey, safeNextPath, setOAuthCookies } from "@/server/auth/session";

export const dynamic = "force-dynamic";

const KAKAO_AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";

// 로그인 시작: CSRF 방지 state를 httpOnly 쿠키에 저장하고 카카오 인가 페이지로 보낸다.
// ?next=/경로 로 로그인 뒤 돌아갈 페이지를 받는다(같은 사이트 경로만).
export function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const clientId = kakaoRestApiKey();

  if (!clientId) {
    console.error("GET /auth/kakao/login: KAKAO_REST_API_KEY is not configured");
    const fallback = new URL(next, request.nextUrl.origin);
    fallback.searchParams.set("login", "unavailable");
    return NextResponse.redirect(fallback);
  }

  const state = randomBytes(24).toString("base64url");
  const authorizeUrl = new URL(KAKAO_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", kakaoRedirectUri());
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  setOAuthCookies(response, state, next);
  return response;
}
