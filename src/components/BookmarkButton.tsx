"use client";

import { useState } from "react";

import { loginHref, toggleBookmark, useBookmarks } from "@/lib/bookmark-store";

interface BookmarkButtonProps {
  noticeId: string;
  // icon: 카드 오른쪽 위 아이콘만, labeled: 상세 페이지처럼 글자와 함께
  variant?: "icon" | "labeled";
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
    >
      <path d="M6 3.75h12a.75.75 0 0 1 .75.75v16.19a.5.5 0 0 1-.8.4L12 16.5l-5.95 4.59a.5.5 0 0 1-.8-.4V4.5A.75.75 0 0 1 6 3.75Z" />
    </svg>
  );
}

// 로그인하지 않았으면 누를 때 카카오 로그인으로 보낸다(로그인 뒤 지금 페이지로 돌아옴).
export default function BookmarkButton({ noticeId, variant = "icon" }: BookmarkButtonProps) {
  const { status, ids } = useBookmarks();
  const [pending, setPending] = useState(false);
  const bookmarked = ids.has(noticeId);
  const label = bookmarked ? "북마크 해제" : "북마크";

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // 카드 전체가 링크라서 버튼 클릭이 상세 이동으로 번지지 않게 막는다.
    event.preventDefault();
    event.stopPropagation();
    if (pending || status === "loading") {
      return;
    }
    if (status === "anonymous") {
      window.location.href = loginHref();
      return;
    }

    setPending(true);
    const result = await toggleBookmark(noticeId);
    setPending(false);
    if (!result.ok) {
      if (result.login) {
        window.location.href = loginHref();
      } else {
        window.alert(result.message);
      }
    }
  }

  const color = bookmarked ? "text-brand-700" : "text-slate-400 hover:text-brand-700";

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={bookmarked}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 ${color}`}
      >
        <BookmarkIcon filled={bookmarked} />
        <span className="text-slate-700">{bookmarked ? "북마크됨" : "북마크"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={bookmarked}
      title={status === "anonymous" ? "로그인하고 북마크" : label}
      disabled={pending}
      className={`rounded-md p-1.5 transition hover:bg-slate-100 disabled:opacity-60 ${color}`}
    >
      <BookmarkIcon filled={bookmarked} />
    </button>
  );
}
