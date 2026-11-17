import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { literata, publicSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Shawn Oakley: legal-AI software",
    template: "%s | Shawn Oakley",
  },
  description:
    "Open-source legal-AI tools and how they work. Software, not legal services.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets data-theme before React hydrates, so the
    // attribute on <html> can differ from the server's markup by design.
    <html
      lang="en"
      className={`${publicSans.variable} ${literata.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-paper font-sans text-ink">
        <Header />
        <main id="main" className="page">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
