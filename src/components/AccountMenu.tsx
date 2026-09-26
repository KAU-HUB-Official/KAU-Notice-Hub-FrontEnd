"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { loginHref, logout, useBookmarks } from "@/lib/bookmark-store";

const LOGIN_MESSAGES: Record<string, string> = {
  failed: "로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  cancelled: "로그인을 취소했습니다.",
  unavailable: "지금은 로그인을 사용할 수 없습니다."
};

// 로그인 콜백이 실패하면 원래 페이지에 ?login=failed 등을 붙여 돌려보낸다. 한 번 보여주고 주소에서 지운다.
function useLoginMessage(): string | null {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("login");
    if (!code) {
      return;
    }
    setMessage(LOGIN_MESSAGES[code] ?? null);
    url.searchParams.delete("login");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);
  return message;
}

export default function AccountMenu() {
  const { status } = useBookmarks();
  const message = useLoginMessage();

  async function handleLogout() {
    await logout();
    if (window.location.pathname.startsWith("/bookmarks")) {
      window.location.href = "/";
    }
  }

  return (
    <div className="flex min-w-0 flex-col items-end gap-1">
      <div className="flex items-center gap-2 text-sm">
        {status === "authenticated" ? (
          <>
            <Link
              href="/bookmarks"
              className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
            >
              내 북마크
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-2 py-1.5 text-slate-500 hover:text-slate-900"
            >
              로그아웃
            </button>
          </>
        ) : status === "anonymous" ? (
          <a
            href={loginHref()}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#FEE500] px-3 py-1.5 font-medium text-[#191919] hover:brightness-95"
          >
            카카오 로그인
          </a>
        ) : (
          <span className="h-8 w-24" aria-hidden />
        )}
      </div>
      {message ? <p className="max-w-[16rem] text-right text-xs text-rose-600">{message}</p> : null}
    </div>
  );
}
