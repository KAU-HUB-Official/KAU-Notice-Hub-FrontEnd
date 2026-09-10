import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "KAU Notice Hub가 수집하는 정보, 쿠키 사용 여부, 처리 위탁 현황과 이용자의 선택권을 안내합니다.",
  alternates: {
    canonical: "/privacy",
  },
};

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "qktjwl123@gmail.com";

const EFFECTIVE_DATE = "2026년 9월 2일";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
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
          개인정보처리방침
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {siteConfig.name}(이하 &ldquo;서비스&rdquo;)은 이용자의 개인정보를
          중요하게 생각하며, 아래와 같이 정보를 수집하고 이용합니다. 시행일:{" "}
          {EFFECTIVE_DATE}
        </p>

        <Section title="1. 회원가입과 개인정보 수집">
          <p>
            서비스는 회원가입 절차가 없으며, 이름·학번·연락처 등 이용자를 직접
            식별할 수 있는 개인정보를 입력받거나 저장하지 않습니다.
          </p>
        </Section>

        <Section title="2. 자동으로 수집되는 정보">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-slate-900">접속 기록</span> —
              서비스 이용 과정에서 IP 주소, 브라우저 종류, 요청 시각 등 일반적인
              접속 정보가 서버 로그에 기록됩니다. IP 주소는 과도한 요청을 막기
              위한 이용량 제한 목적에만 사용합니다.
            </li>
            <li>
              <span className="font-medium text-slate-900">챗봇 대화</span> —
              이용자가 챗봇에 입력한 질문과 그에 대한 답변, 그리고 한 번의
              대화를 구분하기 위해 브라우저에서 임의로 생성한 세션 식별자가
              저장됩니다. 이 식별자는 개인을 식별하지 않으며, 답변 품질 개선과
              오류 분석에 사용합니다.
            </li>
            <li>
              <span className="font-medium text-slate-900">이용 통계</span> —
              페이지 조회수와 성능 측정을 위해 Vercel Analytics 및 Vercel Speed
              Insights를 사용합니다. 해당 도구는 개인을 식별하지 않는 형태의
              집계 정보를 수집합니다.
            </li>
          </ul>
        </Section>

        <Section title="3. 쿠키">
          <p>
            서비스는 광고나 이용자 추적을 위한 쿠키를 사용하지 않습니다. 챗봇
            대화를 구분하는 세션 식별자도 브라우저 메모리에만 존재하며, 페이지를
            새로 고치면 사라집니다.
          </p>
          <p>
            이용 통계에 사용하는 Vercel Analytics와 Speed Insights 역시 이용자를
            식별하는 쿠키를 저장하지 않습니다.
          </p>
        </Section>

        <Section title="4. 제3자 제공 및 처리 위탁">
          <p>
            서비스는 수집한 정보를 판매하거나 광고 목적으로 외부에 제공하지
            않습니다. 서비스 운영을 위해 아래 사업자의 인프라와 도구를
            이용합니다.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Vercel Inc. — 웹사이트 호스팅, 이용 통계 및 성능 측정</li>
            <li>
              OpenAI, L.L.C. — 챗봇 답변 생성. 이용자가 입력한 질문과 답변에
              참고할 공지 본문이 전송됩니다.
            </li>
          </ul>
        </Section>

        <Section title="5. 보유 기간">
          <p>
            서버 접속 로그와 챗봇 대화 기록은 서비스 개선과 오류 대응에 필요한
            기간 동안 보관한 뒤 파기합니다. 관계 법령에서 별도의 보관 의무를
            정한 경우에는 해당 기간을 따릅니다.
          </p>
        </Section>

        <Section title="6. 이용자의 권리">
          <p>
            이용자는 자신과 관련된 기록의 열람, 정정, 삭제를 요청할 수 있습니다.
            서비스는 회원 식별 수단을 두고 있지 않으므로, 요청 시 확인 가능한
            범위(예: 세션 식별자, 요청 시각)를 함께 알려주시면 확인 후 처리해
            드립니다.
          </p>
        </Section>

        <Section title="7. 아동의 개인정보">
          <p>
            서비스는 대학 구성원을 대상으로 하며, 만 14세 미만 아동을 대상으로
            하지 않습니다. 아동의 개인정보를 알고 수집하지 않습니다.
          </p>
        </Section>

        <Section title="8. 외부 링크">
          <p>
            서비스는 학교 홈페이지의 공지 원문과 첨부파일로 연결되는 링크를
            제공합니다. 연결된 사이트에서의 개인정보 처리에는 이 방침이 적용되지
            않으며, 해당 사이트의 정책을 확인해 주셔야 합니다.
          </p>
        </Section>

        <Section title="9. 방침의 변경">
          <p>
            이 방침의 내용이 추가·삭제·수정되는 경우, 변경된 방침을 이 페이지에
            게시하고 시행일을 함께 표시합니다.
          </p>
        </Section>

        <Section title="10. 문의">
          <p>
            개인정보 처리에 관한 문의는 아래로 연락해 주세요.
            <br />
            이메일:{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
              {CONTACT_EMAIL}
            </Link>
          </p>
        </Section>
      </div>
    </main>
  );
}
