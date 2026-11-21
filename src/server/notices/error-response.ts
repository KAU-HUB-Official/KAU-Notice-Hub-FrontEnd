import { NextResponse } from "next/server";

import { BackendApiError } from "./backend-notice-service";

/**
 * 공개 route handler의 공통 catch. 상세 오류는 서버 로그에만 남기고, 브라우저에는
 * 백엔드가 준 사용자용 메시지(`error`)와 상태 코드만 돌려준다. 백엔드 응답 원문(`detail`)은
 * 프록시 HTML 오류 페이지 같은 내부 내용일 수 있어 내보내지 않는다.
 */
export function backendErrorResponse(label: string, error: unknown, fallbackMessage: string) {
  console.error(`${label} failed:`, error);

  if (error instanceof BackendApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
