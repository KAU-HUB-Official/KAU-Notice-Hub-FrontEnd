export type RawNotice = Record<string, unknown>;

export interface NoticeAttachment {
  name: string;
  url: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  url?: string;
  source?: string;
  sources?: string[];
  audienceGroup?: string;
  sourceGroup?: string;
  sourceGroups?: string[];
  category?: string;
  date?: string;
  tags: string[];
  attachments: NoticeAttachment[];
}

export interface NoticeQuery {
  q?: string;
  audienceGroup?: string;
  sourceGroup?: string;
  source?: string;
  page?: number;
  pageSize?: number;
}

export interface NoticeFacets {
  audienceGroups: string[];
  sourceGroups: string[];
  sources: string[];
  categories: string[];
}

export interface NoticeListResult {
  items: Notice[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: NoticeFacets;
}

export interface NoticeNavigationItem {
  id: string;
  title: string;
  date?: string;
}

export interface NoticeNavigation {
  previous: NoticeNavigationItem | null;
  next: NoticeNavigationItem | null;
}

export interface NoticeReference {
  id: string;
  title: string;
  url?: string;
  source?: string;
  date?: string;
}

export interface ChatAnswer {
  answer: string;
  references: NoticeReference[];
  usedFallback?: boolean;
  model?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequestBody {
  question: string;
  history?: ChatMessage[];
  audienceGroup?: string;
  sourceGroup?: string;
  source?: string;
  category?: string;
  department?: string;
  // 한 대화 흐름을 묶는 식별자. 백엔드가 켜져 있을 때만 세션 로깅에 사용한다.
  sessionId?: string;
}

export type ChatStreamEvent =
  | { type: "search_started" }
  | { type: "search_completed"; references: NoticeReference[] }
  | { type: "answer_delta"; delta: string }
  | {
      type: "answer_completed";
      answer: string;
      usedFallback: boolean;
      model: string;
    }
  | { type: "error"; error: string };

// 카카오 로그인·북마크. 계약은 백엔드 docs/API_SPEC.md(User, AuthResult, Bookmark, BookmarkListResult).
export interface User {
  id: string; // 내부 사용자 ID. 카카오 회원번호가 아니다.
  nickname?: string | null; // 카카오 동의항목을 받지 않아 지금은 항상 null
}

export interface AuthResult {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number; // 초
  user: User;
}

export interface Bookmark {
  noticeId: string;
  bookmarkedAt: string; // UTC ISO 8601
  notice: Notice | null; // 공지가 스냅샷에서 빠졌으면 null
  saved: NoticeReference; // 북마크한 시점의 사본. 항상 있다
}

export interface BookmarkListResult {
  items: Bookmark[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BookmarkIdsResult {
  noticeIds: string[];
}
