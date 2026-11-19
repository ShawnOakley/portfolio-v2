"use server";

import { parseReport, type Report } from "@/lib/citecheck";

export type CheckResult =
  { ok: true; report: Report } | { ok: false; error: string };

const origin = process.env.CITECHECK_ORIGIN ?? "http://127.0.0.1:8000";

/** One check per submit. verdicts stays false: this page does not call the model. */
export async function checkBrief(text: string): Promise<CheckResult> {
  const brief = text.trim();
  if (!brief) return { ok: false, error: "Paste the text of a brief." };

  try {
    const response = await fetch(`${origin}/v1/check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: brief, verdicts: false }),
      cache: "no-store",
    });
    if (response.status === 400) {
      return { ok: false, error: "Paste the text of a brief." };
    }
    if (!response.ok) {
      return { ok: false, error: "The checker did not accept that brief." };
    }
    const report = parseReport(await response.json());
    if (!report) {
      return {
        ok: false,
        error: "The checker returned a report this page cannot read.",
      };
    }
    return { ok: true, report };
  } catch {
    return {
      ok: false,
      error:
        "The checker is not running. Start it on this machine, then try again.",
    };
  }
}
