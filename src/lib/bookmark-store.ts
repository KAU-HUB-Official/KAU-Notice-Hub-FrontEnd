"use client";

import { useEffect, useSyncExternalStore } from "react";

// 로그인 상태와 북마크한 공지 ID를 페이지 전체에서 한 번만 불러와 나눠 쓰는 작은 저장소.
// 별도 상태관리 라이브러리 없이 useSyncExternalStore로 구독한다.
// 로그인 여부는 GET /api/bookmarks/ids의 응답(200 = 로그인, 401 = 로그아웃)으로 판단한다.

export type AuthStatus = "loading" | "anonymous" | "authenticated";

interface BookmarkState {
  status: AuthStatus;
  ids: ReadonlySet<string>;
}

let state: BookmarkState = { status: "loading", ids: new Set() };
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();
const SERVER_SNAPSHOT: BookmarkState = { status: "loading", ids: new Set() };

function setState(next: BookmarkState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function load(): Promise<void> {
  try {
    const response = await fetch("/api/bookmarks/ids", { cache: "no-store" });
    if (response.ok) {
      const payload = (await response.json()) as { noticeIds?: string[] };
      setState({ status: "authenticated", ids: new Set(payload.noticeIds ?? []) });
      return;
    }
    setState({ status: "anonymous", ids: new Set() });
  } catch {
    setState({ status: "anonymous", ids: new Set() });
  }
}

function ensureLoaded(): void {
  if (!loading) {
    loading = load();
  }
}

export function useBookmarks(): BookmarkState {
  useEffect(ensureLoaded, []);
  return useSyncExternalStore(subscribe, () => state, () => SERVER_SNAPSHOT);
}

export function loginHref(next?: string): string {
  const path =
    next ?? (typeof window === "undefined" ? "/" : `${window.location.pathname}${window.location.search}`);
  return `/auth/kakao/login?next=${encodeURIComponent(path)}`;
}

export type ToggleResult = { ok: true } | { ok: false; login: true } | { ok: false; login: false; message: string };

// 낙관적으로 바꾼 뒤 요청하고, 실패하면 되돌린다. 추가·삭제는 백엔드에서 멱등이다.
export async function toggleBookmark(noticeId: string): Promise<ToggleResult> {
  if (state.status !== "authenticated") {
    return { ok: false, login: true };
  }

  const wasBookmarked = state.ids.has(noticeId);
  const optimistic = new Set(state.ids);
  if (wasBookmarked) {
    optimistic.delete(noticeId);
  } else {
    optimistic.add(noticeId);
  }
  setState({ status: "authenticated", ids: optimistic });

  try {
    const response = await fetch(`/api/bookmarks/${encodeURIComponent(noticeId)}`, {
      method: wasBookmarked ? "DELETE" : "PUT"
    });
    if (response.ok) {
      return { ok: true };
    }

    const reverted = new Set(state.ids);
    if (wasBookmarked) {
      reverted.add(noticeId);
    } else {
      reverted.delete(noticeId);
    }

    if (response.status === 401) {
      setState({ status: "anonymous", ids: new Set() });
      return { ok: false, login: true };
    }

    setState({ status: "authenticated", ids: reverted });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, login: false, message: payload?.error || "북마크를 변경하지 못했습니다." };
  } catch {
    const reverted = new Set(state.ids);
    if (wasBookmarked) {
      reverted.add(noticeId);
    } else {
      reverted.delete(noticeId);
    }
    setState({ status: "authenticated", ids: reverted });
    return { ok: false, login: false, message: "네트워크 오류로 북마크를 변경하지 못했습니다." };
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
  setState({ status: "anonymous", ids: new Set() });
}
