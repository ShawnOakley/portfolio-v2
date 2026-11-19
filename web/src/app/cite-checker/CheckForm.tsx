"use client";

import { useState, type FormEvent } from "react";
import { checkBrief } from "./actions";
import { ReportView } from "./Report";
import type { Report } from "@/lib/citecheck";

export function CheckForm() {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setReport(null);
    if (text.trim() === "") {
      setError("Paste the text of a brief.");
      return;
    }
    setPending(true);
    const result = await checkBrief(text);
    setPending(false);
    if (!result.ok) {
      setReport(null);
      setError(result.error);
      return;
    }
    setReport(result.report);
  }

  return (
    <div className="mt-site-7">
      <form onSubmit={onSubmit}>
        <label htmlFor="brief" className="font-serif text-step-1">
          Brief
        </label>
        <textarea
          id="brief"
          name="brief"
          rows={12}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={pending}
          className="mt-site-2 w-full rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-3 font-serif text-ink"
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-site-4 inline-block rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-step-small text-ink hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          Check citations
        </button>
        <p className="mt-site-3 text-step-small text-ink-soft">
          Runs against a checker on this computer. It is not a public service.
        </p>
      </form>
      {pending ? (
        <p className="mt-site-5" role="status">
          Checking citations. A short brief takes a few seconds. A long one
          takes longer.
        </p>
      ) : null}
      {error ? (
        <p className="mt-site-5" role="alert">
          {error}
        </p>
      ) : null}
      {report ? (
        <div className="mt-site-7">
          <ReportView report={report} />
        </div>
      ) : null}
    </div>
  );
}
