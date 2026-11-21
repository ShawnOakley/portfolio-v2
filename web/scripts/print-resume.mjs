/**
 * Print the About page's résumé layout to a PDF.
 * Since 2026-11-21 the site's download (public/shawn-oakley-resume.pdf) is the full
 * résumé exported from Word, so running this overwrites it with the short version.
 * Start the site first: pnpm dev --port 3001
 * Then: node scripts/print-resume.mjs
 */
import { chromium } from "@playwright/test";

const url = process.env.RESUME_URL ?? "http://127.0.0.1:3001/about";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.pdf({
  path: "public/shawn-oakley-resume.pdf",
  format: "Letter",
  printBackground: true,
});
await browser.close();
