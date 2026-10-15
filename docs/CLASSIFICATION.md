# 분류와 필터

프론트는 백엔드가 내려주는 `facets`를 기반으로 필터 UI를 그린다. 분류 규칙의 원천은 백엔드이며, 프론트는 URL 상태와 표시 조건만 관리한다.

## 필터 구조

탐색 순서:

1. 내 신분 `target`
2. 게시판(대상자) `audience`
3. 중분류 `group`
4. 세부 홈페이지 `source`
5. 검색어 `q`

## 내 신분 `target`

공지 본문의 적용 대상 라벨로 거른다. 게시판 기준 분류인 `audience`와 별개이고, 둘을 함께 걸 수 있다. 판정은 백엔드가 한다(백엔드 `docs/API_SPEC.md`의 "적용 대상 라벨").

| 화면 이름 | `target` 값 |
| --- | --- |
| 학부 재학생 | `학부재학생` |
| 신입생·편입생 | `신입생·편입생` |
| 일반대학원생 | `일반대학원생` |
| 특수대학원생 | `특수대학원생` |
| 교직원·기타 | `교직원·기타` |

- 대상 라벨이 없는 공지는 어떤 신분을 골라도 보인다.
- 고른 신분은 브라우저 `localStorage`(`knh.target`)에 기억해 다음 방문 때 다시 적용한다. 주소에 `target`이 있으면 주소가 우선이고, 기억한 값은 사용자가 직접 고를 때만 바뀐다. 저장소를 쓸 수 없으면 기억하지 않는다.
- 같은 신분을 다시 누르거나 초기화하면 전체로 돌아가고 기억도 지운다.
- 정의되지 않은 `target` 값은 BFF에서 버린다.

세부 홈페이지 필터는 아래 대상자에서만 노출한다.

- `학부 재학생(학과/전공별)`
- `대학원생`
- `평생·전문교육원`

그 외 대상자는 `source`를 보내지 않는다.

## UI 동작

- 대상자(게시판)를 바꾸면 `group`과 `source`를 초기화한다. 내 신분은 유지한다.
- 중분류를 바꾸면 `source`를 초기화한다.
- 같은 중분류 또는 홈페이지를 다시 선택하면 전체 상태로 되돌린다.
- 필터나 검색어가 바뀌면 `page`는 1로 초기화한다.
- 화면 URL에는 선택된 값만 남긴다. 전체 상태는 query parameter를 제거한다.

## API parameter

목록 API에 전달하는 값:

```text
target
audience
group
source
q
page
pageSize
```

중분류는 `sourceGroup`이라는 내부 타입 이름을 쓰지만 URL과 API query parameter는 `group`으로 유지한다.

## 구현 위치

| 역할 | 파일 |
| --- | --- |
| 내 신분 칩 | `src/components/TargetNav.tsx` |
| 게시판(대상자) 탭 | `src/components/AudienceNav.tsx` |
| 중분류 탭 | `src/components/SourceGroupFilter.tsx` |
| 세부 홈페이지 탭 | `src/components/SourceNav.tsx` |
| 필터 상태와 URL 동기화 | `src/components/notice-explorer.tsx` |
| source 필터 노출 조건, `target` 값 목록 | `src/lib/notices.ts` |
| 백엔드 API 호출 | `src/server/notices/backend-notice-service.ts` |

새 분류나 source가 추가되면 먼저 백엔드 분류 결과와 `facets` 응답을 확인한다. 프론트에서 수정할 가능성이 높은 부분은 `shouldUseSourceFilter`뿐이다.
