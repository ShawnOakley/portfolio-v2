import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteName } from "@/lib/site";

export const alt = `${siteName}. Portfolio of software projects.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const literata = readFile(
  join(
    process.cwd(),
    "node_modules/@fontsource/literata/files/literata-latin-600-normal.woff",
  ),
);
const publicSans = readFile(
  join(
    process.cwd(),
    "node_modules/@fontsource/public-sans/files/public-sans-latin-400-normal.woff",
  ),
);

/** Wide card for link previews. Type stays in the center so a square crop keeps the name. */
export default async function SocialCard() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6f8",
        color: "#10161f",
      }}
    >
      <div
        style={{
          fontFamily: "Literata",
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.05,
        }}
      >
        {siteName}
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: "Public Sans",
          fontSize: 36,
          fontWeight: 400,
          color: "#4a5565",
          lineHeight: 1.3,
        }}
      >
        Portfolio of software projects.
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Literata",
          data: await literata,
          style: "normal",
          weight: 600,
        },
        {
          name: "Public Sans",
          data: await publicSans,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
