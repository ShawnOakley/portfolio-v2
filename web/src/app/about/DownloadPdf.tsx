import { resumePdfPath } from "@/lib/site";

export function DownloadPdf() {
  return (
    <a
      href={resumePdfPath}
      download="Shawn_Oakley_Resume.pdf"
      className="ml-auto inline-block translate-y-[2px] rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-step-small text-ink no-underline hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Download Resume
    </a>
  );
}
