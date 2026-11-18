/** Name in the header, the browser tab, and the résumé. No separate product name. */
export const siteName = "Shawn Oakley";

/** Absolute origin for social image URLs. Vercel sets the host at build time. */
export function siteUrl(): URL {
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (host) return new URL(`https://${host}`);
  return new URL("http://localhost:3000");
}

/** Résumé file in web/public. Served with the site; not an object store. */
export const resumePdfPath = "/shawn-oakley-resume.pdf";
