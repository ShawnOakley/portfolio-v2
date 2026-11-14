import createMDX from "@next/mdx";

// In production Vercel routes /api/* to the FastAPI service (see vercel.json).
// For `pnpm dev` without `vercel dev`, set API_ORIGIN=http://localhost:8000
// to proxy /api/* to a locally running uvicorn.
const apiOrigin = process.env.API_ORIGIN;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cache Components is off on purpose: every page here is static, and with
  // it on an unknown /notes/[slug] streams a shell with status 200 instead of
  // returning a 404. Revisit if a page ever needs per-request data.
  pageExtensions: ["ts", "tsx", "mdx"],
  async rewrites() {
    return apiOrigin
      ? [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }]
      : [];
  },
};

export default createMDX()(nextConfig);
