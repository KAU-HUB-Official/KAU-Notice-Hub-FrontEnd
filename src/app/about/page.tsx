import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "KAU Notice Hub가 한국항공대학교의 흩어진 공지를 어떻게 수집·분류하고, 검색과 챗봇으로 제공하는지 설명합니다.",
  alternates: {
    canonical: "/about",
  },
};

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "qktjwl123@gmail.com";

export default function AboutPage() {
  return (
    <main className="w-full bg-slate-50 px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto w-full min-w-0 max-w-4xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <Link
          href="/"
          className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
        >
          ← 목록으로 돌아가기
        </Link>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
          서비스 소개
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
          {siteConfig.name}은 한국항공대학교의 여러 홈페이지에 흩어져 있는
          공지를 한 화면에서 찾을 수 있게 정리한 학생 제작 서비스입니다.
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">
            왜 만들었나요
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            학사, 장학, 학과, 대학원, 평생·전문교육원 공지는 각각 다른
            홈페이지에 올라옵니다. 필요한 공지 하나를 확인하려면 여러 사이트를
            차례로 열어야 하고, 마감이 지난 뒤에야 공고를 발견하는 일도
            흔합니다. 이 서비스는 그 흩어진 공지를 한곳에 모아, 대상과 출처를
            기준으로 걸러 보고 검색할 수 있게 만드는 것을 목표로 합니다.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">
            공지를 어떻게 정리하나요
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
            <li>
              <span className="font-medium text-slate-900">수집</span> — 학교
              공식 홈페이지에 공개된 공지 목록을 주기적으로 확인해 제목, 게시일,
              본문, 첨부파일, 원문 링크를 가져옵니다.
            </li>
            <li>
              <span className="font-medium text-slate-900">분류</span> — 각
              공지를 읽어야 할 <span className="font-medium">대상자</span>(예:
              학부 재학생, 대학원생, 신입생)와{" "}
              <span className="font-medium">출처 홈페이지</span>를 기준으로
              묶습니다. 학과·전공별 홈페이지처럼 수가 많은 출처는 세부 필터로
              한 번 더 나눕니다.
            </li>
            <li>
              <span className="font-medium text-slate-900">검색</span> — 제목과
              본문을 함께 검색합니다. 검색어와 필터 상태는 주소(URL)에 남아
              그대로 공유하거나 북마크할 수 있습니다.
            </li>
            <li>
              <span className="font-medium text-slate-900">챗봇</span> — 질문과
              관련된 공지를 먼저 찾은 다음, 그 공지 내용을 근거로 답변을
              만들고 참고한 공지 링크를 함께 보여줍니다.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">
            알아두실 점
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
            <li>
              이 서비스는 <span className="font-medium">한국항공대학교의 공식
              서비스가 아니며</span>, 학교 및 산하 기관과 제휴·후원 관계가
              없습니다. 학교를 대신해 공지를 안내하거나 해석해 드리지 않습니다.
            </li>
            <li>
              공지의 저작권과 책임은 각 원문 게시 기관에 있습니다. 이 서비스는
              탐색을 돕기 위해 출처와 원문 링크를 항상 함께 표시합니다.
            </li>
            <li>
              수집 시점과 학교 홈페이지의 수정 시점이 달라 내용이 최신이 아닐
              수 있습니다. 신청 기간, 마감일, 제출 서류처럼 중요한 정보는{" "}
              <span className="font-medium">반드시 공지 원문에서 확인</span>해
              주세요.
            </li>
            <li>
              챗봇 답변은 AI가 생성한 것으로 부정확할 수 있습니다. 답변에 붙은
              근거 공지를 직접 확인하시는 것을 권장합니다.
            </li>
            <li>
              게시 중단이나 수정이 필요한 공지가 있다면 아래 메일로 알려주시면
              확인 후 조치하겠습니다.
            </li>
          </ul>
        </section>

        <section className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-900">문의</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            서비스 오류, 공지 누락, 삭제 요청 등은 아래로 연락해 주세요.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            이메일:{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
              {CONTACT_EMAIL}
            </Link>
          </p>
          <p className="mt-1 text-sm leading-7 text-slate-700">
            개인정보 처리에 대한 안내는{" "}
            <Link href="/privacy" className="hover:underline">
              개인정보처리방침
            </Link>
            을 확인해 주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
