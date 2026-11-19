import createMDX from "@next/mdx";

// In production Vercel routes /api/* to the FastAPI service (see vercel.json).
// For `pnpm dev` without `vercel dev`, set API_ORIGIN=http://localhost:8000
// to proxy /api/* to a locally running uvicorn.
const apiOrigin = process.env.API_ORIGIN;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // A brief PDF may be up to 20 MB. The checker rejects anything larger.
      bodySizeLimit: "21mb",
    },
  },
  // Cache Components is off on purpose: every page here is static, and with
  // it on an unknown /notes/[slug] streams a shell with status 200 instead of
  // returning a 404. Revisit if a page ever needs per-request data.
  pageExtensions: ["ts", "tsx", "mdx"],
  // The card reads these files with readFile. Tracing has to be told, or the
  // production function ships without the fonts.
  outputFileTracingIncludes: {
    "/opengraph-image": [
      "./node_modules/@fontsource/literata/files/literata-latin-600-normal.woff",
      "./node_modules/@fontsource/public-sans/files/public-sans-latin-400-normal.woff",
    ],
    "/twitter-image": [
      "./node_modules/@fontsource/literata/files/literata-latin-600-normal.woff",
      "./node_modules/@fontsource/public-sans/files/public-sans-latin-400-normal.woff",
    ],
  },
  async redirects() {
    return [{ source: "/", destination: "/about", permanent: false }];
  },
  async rewrites() {
    return apiOrigin
      ? [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }]
      : [];
  },
};

export default createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
})(nextConfig);
