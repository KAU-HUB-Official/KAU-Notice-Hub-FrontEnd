import { Fragment } from "react";

interface InlineBoldProps {
  text: string;
  /** 스트리밍 중이면 끝의 `*` 하나(나뉘어 도착한 `**`의 앞 반쪽)를 잠깐 숨긴다. */
  streaming?: boolean;
}

/**
 * 챗봇 답변에서 `**굵게**`만 굵은 글씨로 보여준다. 다른 마크다운은 글자 그대로 둔다.
 *
 * 답변 모델(gpt-6-luna)이 핵심 문장을 `**`로 감싸는데, 챗봇 말풍선은 일반 텍스트라
 * 별표가 그대로 보였다. 스트리밍 중 닫는 `**`가 아직 오지 않은 구간은 일반 글자로
 * 보여주고, 짝 없는 `**` 기호는 숨긴다.
 */
export function InlineBold({ text, streaming = false }: InlineBoldProps) {
  const shown = streaming && /[^*]\*$|^\*$/.test(text) ? text.slice(0, -1) : text;
  const parts = shown.split("**");
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        const closed = index < parts.length - 1;
        if (index % 2 === 1 && closed) {
          return (
            <strong key={index} className="font-semibold text-slate-900">
              {part}
            </strong>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
