import localFont from "next/font/local";

/*
 * Fonts are self-hosted from npm packages: no request to a font CDN at build
 * time or in the visitor's browser.
 *
 * Public Sans: the U.S. government's open typeface. Interface text.
 * Literata: a book face with sturdy serifs. Filings, opinions, long reading.
 */
export const publicSans = localFont({
  variable: "--font-public-sans",
  display: "swap",
  src: [
    {
      path: "../../node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});

export const literata = localFont({
  variable: "--font-literata",
  display: "swap",
  src: [
    {
      path: "../../node_modules/@fontsource-variable/literata/files/literata-latin-wght-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/literata/files/literata-latin-wght-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
});
