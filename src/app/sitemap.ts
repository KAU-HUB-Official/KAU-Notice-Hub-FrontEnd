import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { noticeService } from "@/server/notices";

export const dynamic = "force-dynamic";

// 백엔드 pageSize 상한이 100이라 페이지를 돌며 모은다.
const NOTICE_SITEMAP_PAGE_SIZE = 100;
// 사이트맵 한 파일의 URL 상한(50,000)을 넘지 않게 하는 안전장치.
const NOTICE_SITEMAP_MAX_PAGES = 490;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "hourly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${siteConfig.url}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];

  // 백엔드 부하를 늘리지 않도록 순서대로 요청한다. 중간에 실패하면 그때까지 모은 공지만 싣는다.
  try {
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages && page <= NOTICE_SITEMAP_MAX_PAGES) {
      const result = await noticeService.listNotices({
        page,
        pageSize: NOTICE_SITEMAP_PAGE_SIZE
      });
      totalPages = result.totalPages;

      for (const notice of result.items) {
        if (!notice.id) {
          continue;
        }

        entries.push({
          url: `${siteConfig.url}/notices/${encodeURIComponent(notice.id)}`,
          lastModified: notice.date || undefined,
          changeFrequency: "weekly",
          priority: 0.7
        });
      }
      page += 1;
    }
  } catch (error) {
    console.error("Failed to build notice sitemap entries:", error);
  }

  return entries;
}
