"use client";

import { useState } from "react";

import { loginHref } from "@/lib/bookmark-store";

// 회원 탈퇴: 백엔드가 사용자와 북마크를 모두 지우고, BFF가 로그인 쿠키를 지운다.
export default function WithdrawButton() {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) {
      return;
    }
    const confirmed = window.confirm(
      "회원 탈퇴하면 저장한 북마크가 모두 삭제되고 되돌릴 수 없습니다. 탈퇴할까요?"
    );
    if (!confirmed) {
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/me", { method: "DELETE" });
      if (response.ok) {
        window.alert("탈퇴했습니다. 카카오 계정의 앱 연결은 카카오 계정 설정에서 끊을 수 있습니다.");
        window.location.href = "/";
        return;
      }
      // 401은 로그인이 만료됐거나(계정은 남아 있음) 이미 탈퇴한 경우다. 둘을 구분할 수 없으므로
      // 탈퇴했다고 알리지 않고, 다시 로그인한 뒤 탈퇴하게 한다.
      if (response.status === 401) {
        window.alert("로그인이 만료되어 탈퇴를 처리하지 못했습니다. 다시 로그인한 뒤 탈퇴해 주세요.");
        window.location.href = loginHref();
        return;
      }
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      window.alert(payload?.error || "회원 탈퇴를 처리하지 못했습니다.");
    } catch {
      window.alert("네트워크 오류로 회원 탈퇴를 처리하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm text-slate-500 underline-offset-2 hover:text-rose-700 hover:underline disabled:opacity-60"
    >
      {pending ? "처리 중…" : "회원 탈퇴"}
    </button>
  );
}
