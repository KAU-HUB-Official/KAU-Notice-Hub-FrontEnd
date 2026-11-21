import { NextResponse } from "next/server";

import { normalizeTarget } from "@/lib/notices";
import { ChatRequestBody } from "@/lib/types";
import { backendErrorResponse } from "@/server/notices/error-response";
import { noticeService } from "@/server/notices";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatRequestBody>;
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json(
        { error: "question 필드는 필수입니다." },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: "질문은 500자 이하로 입력해주세요." },
        { status: 400 }
      );
    }

    const answer = await noticeService.askChat({
      question,
      history: body.history,
      audienceGroup: body.audienceGroup,
      sourceGroup: body.sourceGroup,
      source: body.source,
      userGroup: normalizeTarget(body.userGroup),
      sessionId: body.sessionId
    });

    return NextResponse.json(answer);
  } catch (error) {
    return backendErrorResponse("POST /api/chat", error, "챗봇 응답을 생성하지 못했습니다.");
  }
}
