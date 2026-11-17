"use client";

export function DownloadPdf() {
  return (
    <button
      type="button"
      className="cursor-pointer border-0 bg-transparent px-0 py-site-1 text-step-small text-accent underline decoration-1 underline-offset-[0.18em] hover:decoration-2"
      onClick={() => window.print()}
    >
      Download Resume
    </button>
  );
}
