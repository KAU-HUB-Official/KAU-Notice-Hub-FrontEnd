// 운영 도메인. Vercel 기본 별칭으로도 같은 사이트가 열리면 색인이 두 도메인으로
// 쪼개지므로, 별칭 요청은 운영 도메인으로 영구 이동시킨다.
const PRODUCTION_HOST = "kau-notice-hub.app";
const LEGACY_HOSTS = ["kau-notice-hub.vercel.app"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return LEGACY_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: `https://${PRODUCTION_HOST}/:path*`,
      permanent: true
    }));
  }
};

export default nextConfig;
