"use client";

import { ALL_TARGETS, TARGET_OPTIONS } from "@/lib/notices";

interface TargetNavProps {
  selectedTarget: string;
  onSelect: (target: string) => void;
}

// 공지 본문의 적용 대상(백엔드 라벨) 기준 필터. 게시판 기준인 AudienceNav와 구분되도록
// 둥근 칩 모양을 쓴다.
export default function TargetNav({ selectedTarget, onSelect }: TargetNavProps) {
  const items = [{ value: ALL_TARGETS, label: "전체" }, ...TARGET_OPTIONS];

  return (
    <nav aria-label="내 신분 필터" className="w-full min-w-0">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start">
        <span className="shrink-0 pt-1.5 text-xs font-semibold text-slate-500 sm:w-14">
          내 신분
        </span>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap gap-2">
            {items.map((item) => {
              const active = selectedTarget === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelect(item.value)}
                  aria-pressed={active}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            공지 본문의 적용 대상으로 거릅니다. 대상이 정해지지 않은 공지는 함께 보여요.
          </p>
        </div>
      </div>
    </nav>
  );
}
