import { Notice } from "@/lib/types";

export const ALL_SOURCES = "__ALL_SOURCES__";
export const ALL_AUDIENCE_GROUPS = "__ALL_AUDIENCES__";
export const ALL_SOURCE_GROUPS = "__ALL_SOURCE_GROUPS__";
export const DEPARTMENT_AUDIENCE_GROUP = "학부 재학생(학과/전공별)";
export const ALL_TARGETS = "__ALL_TARGETS__";
// 선택한 신분을 다음 방문 때도 쓰려고 브라우저에만 기억한다. 서버에는 목록 조회 때 target으로만 간다.
export const TARGET_STORAGE_KEY = "knh.target";

// 백엔드 GET /api/notices의 target 값(공지 적용 대상 라벨 기준)과 화면 이름.
// 라벨이 없는 공지는 어떤 신분을 골라도 보인다. 판정은 백엔드가 한다.
export const TARGET_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "학부재학생", label: "학부 재학생" },
  { value: "신입생·편입생", label: "신입생·편입생" },
  { value: "일반대학원생", label: "일반대학원생" },
  { value: "특수대학원생", label: "특수대학원생" },
  { value: "교직원·기타", label: "교직원·기타" }
];

const EMPTY_TOKENS = new Set([
  "",
  "-",
  "_",
  "n/a",
  "na",
  "none",
  "null",
  "undefined",
  "미분류"
]);

const ALL_FILTER_TOKENS = new Set([
  ALL_SOURCES.toLowerCase(),
  ALL_AUDIENCE_GROUPS.toLowerCase(),
  ALL_SOURCE_GROUPS.toLowerCase(),
  "all",
  "전체",
  "전체홈페이지",
  "전체 홈페이지",
  "전체중분류",
  "전체 중분류",
  "전체대상",
  "전체 대상"
]);

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeToken(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function uniquePreserveOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    result.push(value);
  }

  return result;
}

export function normalizeFacetValue(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = normalizeWhitespace(value);
  if (!normalized || EMPTY_TOKENS.has(normalized.toLowerCase())) {
    return undefined;
  }

  return normalized;
}

export function normalizeFilterValue(value: unknown): string | undefined {
  const normalized = normalizeFacetValue(value);
  if (!normalized || ALL_FILTER_TOKENS.has(normalizeToken(normalized))) {
    return undefined;
  }

  return normalized;
}

export function normalizeTarget(value: unknown): string | undefined {
  const normalized = normalizeFacetValue(value);
  return TARGET_OPTIONS.some((option) => option.value === normalized) ? normalized : undefined;
}

export function getTargetLabel(value: string): string {
  return TARGET_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getNoticeSourceNames(notice: Pick<Notice, "source" | "sources">): string[] {
  const fromList = Array.isArray(notice.sources)
    ? notice.sources
        .map((source) => normalizeFacetValue(source))
        .filter((source): source is string => Boolean(source))
    : [];

  const fallback = normalizeFacetValue(notice.source);
  return uniquePreserveOrder(fallback ? [...fromList, fallback] : fromList);
}

export function shouldUseSourceFilter(audienceGroup?: string): boolean {
  const normalizedAudience = normalizeFilterValue(audienceGroup);
  return (
    normalizedAudience === DEPARTMENT_AUDIENCE_GROUP ||
    normalizedAudience === "대학원생" ||
    normalizedAudience === "평생·전문교육원"
  );
}

export function formatSourceLabel(source: string): string {
  const normalized = normalizeWhitespace(source);
  const compact = normalized.replace(/^한국항공대학교\s*/, "");
  return compact || normalized;
}

// 브라우저는 href의 C0/C1 제어문자를 무시하고 URL을 해석한다.
// ("java\tscript:alert(1)" -> javascript 스킴) 그래서 스킴을 보기 전에 먼저 제거한다.
const URL_CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/g;
const URL_SCHEME_PATTERN = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;

/**
 * 링크로 렌더해도 되는 URL만 통과시킨다.
 *
 * 백엔드·크롤러·LLM이 내려준 값이 그대로 `<a href>`에 들어가므로 `javascript:`,
 * `data:` 같은 스킴이 섞이면 클릭 시 스크립트가 실행될 수 있다.
 * 스킴이 있으면 http(s)만 허용하고, 스킴이 없는 상대 경로는 그대로 통과시킨다.
 * 허용되지 않으면 null을 돌려주고, 호출부에서 링크 대신 텍스트로 표시한다.
 */
export function safeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim().replace(URL_CONTROL_CHARS, "");
  if (!cleaned) {
    return null;
  }

  const scheme = URL_SCHEME_PATTERN.exec(cleaned);
  if (!scheme) {
    return cleaned;
  }

  const protocol = scheme[1].toLowerCase();
  return protocol === "http" || protocol === "https" ? cleaned : null;
}
