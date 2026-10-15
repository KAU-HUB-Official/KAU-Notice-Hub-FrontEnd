"use client";

import { useCallback, useSyncExternalStore } from "react";

import { ALL_TARGETS, TARGET_STORAGE_KEY, normalizeTarget } from "@/lib/notices";

// 공지 목록과 챗봇이 함께 쓰는 '공지 대상' 선택.
// - 사용자가 직접 고른 값만 localStorage에 기억한다(persist).
// - 공유 링크의 ?target=처럼 화면에만 적용할 값은 persist=false로 바꾼다.
// - 같은 탭의 다른 컴포넌트(목록 ↔ 챗봇 패널 2개)는 이벤트로, 다른 탭은 storage 이벤트로 맞춘다.
// localStorage는 시크릿 창·차단 설정에서 예외를 던질 수 있어 항상 감싼다.

const CHANGE_EVENT = "knh:target-change";

let current: string | null = null;

function readStored(): string {
  try {
    return normalizeTarget(window.localStorage.getItem(TARGET_STORAGE_KEY)) ?? ALL_TARGETS;
  } catch {
    return ALL_TARGETS;
  }
}

function writeStored(target: string): void {
  try {
    if (target === ALL_TARGETS) {
      window.localStorage.removeItem(TARGET_STORAGE_KEY);
    } else {
      window.localStorage.setItem(TARGET_STORAGE_KEY, target);
    }
  } catch {
    // 기억하지 못해도 현재 화면의 선택은 그대로 동작한다.
  }
}

export function getCurrentTarget(): string {
  if (current === null) {
    current = readStored();
  }
  return current;
}

export function setCurrentTarget(target: string, { persist = true } = {}): void {
  const next = normalizeTarget(target) ?? ALL_TARGETS;
  if (persist) {
    writeStored(next);
  }
  if (next === getCurrentTarget()) {
    return;
  }
  current = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key === null || event.key === TARGET_STORAGE_KEY) {
      current = readStored();
      onChange();
    }
  }
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function subscribeTarget(onChange: (target: string) => void): () => void {
  return subscribe(() => onChange(getCurrentTarget()));
}

// 서버 렌더와 첫 하이드레이션에서는 선택 없음(ALL_TARGETS)으로 그리고, 이후 저장된 값으로 바뀐다.
export function useCurrentTarget(): [string, (target: string) => void] {
  const target = useSyncExternalStore(subscribe, getCurrentTarget, () => ALL_TARGETS);
  const update = useCallback((next: string) => setCurrentTarget(next), []);
  return [target, update];
}
