"use client";

import { useEffect, useRef, useState } from "react";

import { ALL_TARGETS, TARGET_OPTIONS, getTargetLabel } from "@/lib/notices";

interface ChatTargetSelectProps {
  target: string;
  onChange: (target: string) => void;
}

// 선택지마다 무엇이 보이는지 한 줄로 알려 준다(판정 규칙은 백엔드 app/notice_labels.py).
const TARGET_HINTS: Record<string, string> = {
  [ALL_TARGETS]: "대상 구분 없이 모든 공지에서 찾아요",
  학부재학생: "학부생 대상 공지",
  "신입생·편입생": "신입생 공지와 학부 재학생 공지",
  일반대학원생: "일반대학원 석·박사 대상 공지",
  특수대학원생: "항공·경영대학원, 항공우주정책대학원",
  "교직원·기타": "교직원, 부속기관 교육생, 외부 대상 공지"
};

const OPTIONS = [{ value: ALL_TARGETS, label: "전체" }, ...TARGET_OPTIONS];

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
      <path
        d="M5 10.5L8.5 14L15 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 입력란 바로 위의 공지 대상 선택. 질문 직전에 보이도록 두고, 목록은 대화 영역 위로 떠서
// 위쪽으로 열린다(아래는 화면 끝이라 잘린다).
export default function ChatTargetSelect({ target, onChange }: ChatTargetSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = target !== ALL_TARGETS;

  useEffect(() => {
    if (!open) {
      return;
    }
    function handlePointer(event: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex min-w-0 items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
          selected
            ? "border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span className="font-semibold text-slate-500">대상</span>
        <span className="font-medium">{selected ? getTargetLabel(target) : "전체"}</span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "" : "rotate-180"}`}
        >
          <path
            d="M5.5 8L10 12.5L14.5 8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {selected ? null : (
        <span className="min-w-0 truncate text-xs text-slate-400">고르면 해당 공지에서 찾아요</span>
      )}

      {open ? (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <ul role="listbox" aria-label="공지 대상" className="max-h-80 overflow-y-auto py-1">
            {OPTIONS.map((option) => {
              const active = target === option.value;
              return (
                <li key={option.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-start gap-2 px-3 py-2 text-left transition ${
                      active ? "bg-brand-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium ${active ? "text-brand-700" : "text-slate-800"}`}
                      >
                        {option.label}
                      </span>
                      <span className="block text-xs text-slate-500">{TARGET_HINTS[option.value]}</span>
                    </span>
                    <span className={`mt-0.5 ${active ? "text-brand-600" : "text-transparent"}`}>
                      <Check />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            공지 목록의 &lsquo;공지 대상&rsquo;도 같이 바뀌어요.
          </p>
        </div>
      ) : null}
    </div>
  );
}
