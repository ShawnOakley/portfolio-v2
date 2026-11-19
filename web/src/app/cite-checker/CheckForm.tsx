"use client";

import { useEffect, useState, type FormEvent } from "react";
import { checkBrief, listModels } from "./actions";
import { ReportView } from "./Report";
import type { CheckModel, Report } from "@/lib/citecheck";

export function CheckForm() {
  const [text, setText] = useState("");
  const [models, setModels] = useState<CheckModel[]>([]);
  const [modelId, setModelId] = useState("");
  const [modelNote, setModelNote] = useState<string | null>(null);
  const [askSupport, setAskSupport] = useState(false);
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
          disabled={pending || models.length === 0}
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
        {modelNote ? (
          <p className="mt-site-2 text-step-small text-ink-soft">{modelNote}</p>
        ) : null}
        <label className="mt-site-4 flex items-start gap-site-2">
          <input
            type="checkbox"
            checked={askSupport}
            onChange={(event) => setAskSupport(event.target.checked)}
            disabled={pending}
            className="mt-1"
          />
          <span>Ask whether the case supports the sentence</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-site-4 inline-block rounded-site border border-rule-strong bg-paper-raised px-site-3 py-site-1 text-step-small text-ink hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          Check citations
        </button>
        <p className="mt-site-3 text-step-small text-ink-soft">
          Runs against a checker on this computer. It is not a public service.
          Support stays off until that box is checked, and then the check waits
          on the selected model.
        </p>
      </form>
      {pending ? (
        <p className="mt-site-5" role="status">
          {askSupport
            ? "Asking the model whether each case supports the sentence. This can take several minutes."
            : "Checking citations. A short brief takes a few seconds. A long one takes longer."}
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
