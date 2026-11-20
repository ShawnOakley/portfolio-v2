"use client";

import { useEffect, useState, type DragEvent, type FormEvent } from "react";
import { Notice } from "@/components/ui/Notice";
import { checkBrief, extractBrief, listModels } from "./actions";
import { ReportView } from "./Report";
import {
  extractError,
  MAX_PDF_BYTES,
  type CheckModel,
  type Report,
} from "@/lib/citecheck";

export function CheckForm() {
  const [text, setText] = useState("");
  const [models, setModels] = useState<CheckModel[]>([]);
  const [modelId, setModelId] = useState("");
  const [modelNote, setModelNote] = useState<string | null>(null);
  const [askSupport, setAskSupport] = useState(false);
  const [pages, setPages] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [reading, setReading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listModels().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setModelNote(result.error);
        return;
      }
      setModels(result.models);
      const first = result.models.find((model) => model.available);
      setModelId(first?.id ?? "");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function readPdf(file: File) {
    setError(null);
    setReport(null);
    if (file.size > MAX_PDF_BYTES) {
      setError(extractError("PDF is larger than 20 MB"));
      return;
    }
    const body = new FormData();
    body.set("file", file);
    if (pages.trim()) body.set("pages", pages.trim());
    setReading(true);
    const result = await extractBrief(body);
    setReading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setText(result.text);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    if (pending || reading) return;
    const file = event.dataTransfer.files[0];
    if (file) void readPdf(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || reading) return;
    setError(null);
    setReport(null);
    if (text.trim() === "") {
      setError("Paste the text of a brief.");
      return;
    }
    setPending(true);
    const result = await checkBrief(
      text,
      askSupport,
      askSupport ? modelId : null,
    );
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
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-site border border-dashed px-site-3 py-site-4 ${dragOver ? "border-ink bg-paper-raised" : "border-rule-strong"}`}
        >
          <input
            id="pdf"
            name="pdf"
            type="file"
            accept="application/pdf,.pdf"
            disabled={pending || reading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void readPdf(file);
              event.target.value = "";
            }}
            className="sr-only"
          />
          <div className="grid w-fit grid-cols-[max-content_max-content] items-center gap-x-site-6">
            <p className="font-serif text-step-1">Select Document</p>
            <label htmlFor="pages" className="font-serif text-step-1">
              Page range
            </label>
            <label
              htmlFor="pdf"
              className={`mt-site-4 inline-block rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-step-small text-ink ${pending || reading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
            >
              Choose file
            </label>
            <input
              id="pages"
              name="pages"
              value={pages}
              onChange={(event) => setPages(event.target.value)}
              disabled={pending || reading}
              className="mt-site-4 w-32 rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-ink"
            />
          </div>
          <p className="mt-site-2 text-step-small text-ink-soft">
            Page range is optional. Default is the entire PDF. Ranges should be
            made in the format &quot;Start-End&quot;, e.g. 1-5 is pages 1-5.
          </p>
        </div>
        <label
          htmlFor="brief"
          className="mt-site-5 block font-serif text-step-1"
        >
          Brief
        </label>
        <textarea
          id="brief"
          name="brief"
          rows={12}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={pending || reading}
          className="mt-site-2 w-full rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-3 font-serif text-ink"
        />
        <label
          htmlFor="model"
          className="mt-site-4 block font-serif text-step-1"
        >
          Model
        </label>
        <select
          id="model"
          name="model"
          value={modelId}
          onChange={(event) => setModelId(event.target.value)}
          disabled={pending || reading || models.length === 0}
          className="mt-site-2 block rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-ink"
        >
          {models.length === 0 ? (
            <option value="">No model listed</option>
          ) : null}
          {models.map((model) => (
            <option key={model.id} value={model.id} disabled={!model.available}>
              {model.label}
            </option>
          ))}
        </select>
        {modelNote ? <Notice tone="error">{modelNote}</Notice> : null}
        <label className="mt-site-4 flex items-start gap-site-2">
          <input
            type="checkbox"
            checked={askSupport}
            onChange={(event) => setAskSupport(event.target.checked)}
            disabled={pending || reading}
            className="mt-1"
          />
          <span>Ask whether the case supports the sentence</span>
        </label>
        <button
          type="submit"
          disabled={pending || reading}
          className="mt-site-4 inline-block rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-step-small text-ink hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          Check citations
        </button>
        <p className="mt-site-3 text-step-small text-ink-soft">
          If you check the box, the selected model also says whether the case
          supports the sentence. That takes several minutes.
        </p>
      </form>
      {reading ? <Notice tone="progress">Reading the PDF.</Notice> : null}
      {pending ? (
        <Notice tone="progress">
          {askSupport
            ? "Asking the model whether each case supports the sentence. This can take several minutes."
            : "Checking citations. A short brief takes a few seconds. A long one takes longer."}
        </Notice>
      ) : null}
      {error ? <Notice tone="error">{error}</Notice> : null}
      {report ? (
        <div className="mt-site-7">
          <ReportView report={report} />
        </div>
      ) : null}
    </div>
  );
}
