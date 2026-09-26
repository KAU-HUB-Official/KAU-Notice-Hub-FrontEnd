import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import AccountMenu from "@/components/AccountMenu";
import BookmarkButton from "@/components/BookmarkButton";
import NoticeCard from "@/components/NoticeCard";
import WithdrawButton from "@/components/WithdrawButton";
import { formatSourceLabel, safeHttpUrl } from "@/lib/notices";
import { Bookmark, BookmarkListResult } from "@/lib/types";
import { getAccessToken } from "@/server/auth/session";
import { noticeService } from "@/server/notices";
import { BackendApiError } from "@/server/notices/backend-notice-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "내 북마크",
  robots: { index: false, follow: false }
};

const PAGE_SIZE = 20;
const LOGIN_PATH = `/auth/kakao/login?next=${encodeURIComponent("/bookmarks")}`;

interface BookmarksPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function formatBookmarkedAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  // bookmarkedAt은 UTC다. 한국 시간으로 보여준다.
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(parsed);
}

// 공지가 1년이 지나 스냅샷에서 빠지면 notice가 null이다. 북마크 시점에 저장한 제목·원문 링크로 보여준다.
function RemovedNoticeCard({ bookmark }: { bookmark: Bookmark }) {
  const originalUrl = safeHttpUrl(bookmark.saved.url);
  return (
    <article className="relative w-full min-w-0 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3.5 md:p-4">
      <p className="pr-8 text-[11px] font-medium text-slate-500">목록에서 내려간 공지</p>
      <h3 className="mt-1 line-clamp-2 break-words pr-8 text-base font-semibold leading-snug text-slate-700">
        {bookmark.saved.title}
      </h3>
      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
        {bookmark.saved.date ? <span>{bookmark.saved.date}</span> : null}
        {bookmark.saved.source ? (
          <>
            <span aria-hidden className="text-slate-300">·</span>
            <span className="break-words">{formatSourceLabel(bookmark.saved.source)}</span>
          </>
        ) : null}
      </div>
      {originalUrl ? (
        <a
          href={originalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-brand-700 hover:underline"
        >
          원문 보기
        </a>
      ) : null}
      <div className="absolute right-2 top-2">
        <BookmarkButton noticeId={bookmark.noticeId} />
      </div>
    </article>
  );
}

export default async function BookmarksPage({ searchParams }: BookmarksPageProps) {
  const accessToken = getAccessToken();
  if (!accessToken) {
    redirect(LOGIN_PATH);
  }

  const page = parsePage(searchParams?.page);
  let result: BookmarkListResult;
  try {
    result = await noticeService.listBookmarks(accessToken, page, PAGE_SIZE);
  } catch (error) {
    // 토큰이 만료됐거나 탈퇴한 경우. 다시 로그인하면 새 토큰으로 쿠키를 덮어쓴다.
    if (error instanceof BackendApiError && error.status === 401) {
      redirect(LOGIN_PATH);
    }
    throw error;
  }

  return (
    <main className="w-full bg-slate-50 px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            ← 목록으로 돌아가기
          </Link>
          <AccountMenu />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">내 북마크</h1>
        <p className="mt-2 text-sm text-slate-600">
          최근에 북마크한 순서입니다. 총{" "}
          <strong className="text-slate-950">{result.total.toLocaleString("ko-KR")}</strong>건
        </p>

        {result.items.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            아직 북마크한 공지가 없습니다. 공지 카드의 북마크 아이콘을 눌러 저장해 보세요.
          </div>
        ) : (
          <ul className="mt-6 grid gap-3">
            {result.items.map((bookmark) => (
              <li key={bookmark.noticeId} className="min-w-0">
                <p className="mb-1 text-[11px] text-slate-400">
                  {formatBookmarkedAt(bookmark.bookmarkedAt)} 저장
                </p>
                {bookmark.notice ? (
                  <NoticeCard notice={bookmark.notice} showCategory={false} />
                ) : (
                  <RemovedNoticeCard bookmark={bookmark} />
                )}
              </li>
            ))}
          </ul>
        )}

        {result.totalPages > 1 ? (
          <nav className="mt-6 flex items-center justify-center gap-3 text-sm" aria-label="북마크 페이지">
            {result.page > 1 ? (
              <Link href={`/bookmarks?page=${result.page - 1}`} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50">
                이전
              </Link>
            ) : null}
            <span className="text-slate-600">
              {result.page} / {result.totalPages}
            </span>
            {result.page < result.totalPages ? (
              <Link href={`/bookmarks?page=${result.page + 1}`} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50">
                다음
              </Link>
            ) : null}
          </nav>
        ) : null}

        <div className="mt-10 border-t border-slate-200 pt-4 text-right">
          <WithdrawButton />
        </div>
      </div>
    </main>
  );
}
