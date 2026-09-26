import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site";
import { BackendApiError } from "@/server/notices/backend-notice-service";

// 백엔드가 발급한 액세스 토큰(JWT)은 브라우저 JS가 읽을 수 없는 httpOnly 쿠키에만 둔다.
// 브라우저는 프론트 /api/*만 호출하고, BFF route가 쿠키의 토큰을 Authorization 헤더로 붙인다.
export const SESSION_COOKIE = "knh_session";
// 카카오 인가 요청의 CSRF 방지 state와 로그인 뒤 돌아갈 경로. 콜백에서 확인하고 지운다.
export const OAUTH_STATE_COOKIE = "knh_oauth_state";
export const OAUTH_NEXT_COOKIE = "knh_oauth_next";
const OAUTH_COOKIE_MAX_AGE = 10 * 60;

const secure = process.env.NODE_ENV === "production";

export function getAccessToken(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value || undefined;
}

export function setSessionCookie(response: NextResponse, accessToken: string, maxAge: number): void {
  response.cookies.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 0 });
}

export function setOAuthCookies(response: NextResponse, state: string, next: string): void {
  const options = { httpOnly: true, secure, sameSite: "lax" as const, path: "/auth/kakao", maxAge: OAUTH_COOKIE_MAX_AGE };
  response.cookies.set(OAUTH_STATE_COOKIE, state, options);
  response.cookies.set(OAUTH_NEXT_COOKIE, next, options);
}

export function clearOAuthCookies(response: NextResponse): void {
  const options = { httpOnly: true, secure, sameSite: "lax" as const, path: "/auth/kakao", maxAge: 0 };
  response.cookies.set(OAUTH_STATE_COOKIE, "", options);
  response.cookies.set(OAUTH_NEXT_COOKIE, "", options);
}

// 로그인 뒤 돌아갈 경로는 같은 사이트 안의 경로만 허용한다(오픈 리다이렉트 방지).
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  return value;
}

// 카카오 콘솔과 백엔드 KAKAO_ALLOWED_REDIRECT_URIS에 등록한 값과 정확히 같아야 한다.
export function kakaoRedirectUri(): string {
  return process.env.KAKAO_REDIRECT_URI?.trim() || `${siteConfig.url}/auth/kakao/callback`;
}

export function kakaoRestApiKey(): string | undefined {
  return process.env.KAKAO_REST_API_KEY?.trim() || undefined;
}

const UNAUTHORIZED_MESSAGE = "로그인이 필요합니다.";

// 로그인이 필요한 BFF route 공통 처리: 토큰이 없으면 401, 백엔드가 401이면 쿠키를 지운다.
// 내부 예외 상세는 클라이언트에 넘기지 않는다.
export async function withAccessToken(
  label: string,
  fallbackMessage: string,
  handler: (accessToken: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: UNAUTHORIZED_MESSAGE }, { status: 401 });
  }

  try {
    return await handler(accessToken);
  } catch (error) {
    if (error instanceof BackendApiError) {
      const response = NextResponse.json({ error: error.message }, { status: error.status });
      if (error.status === 401) {
        clearSessionCookie(response);
      }
      return response;
    }

    console.error(`${label} failed:`, error);
    return NextResponse.json({ error: fallbackMessage }, { status: 500 });
  }
}
