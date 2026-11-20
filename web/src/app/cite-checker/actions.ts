"use server";

import {
  checkFailure,
  checkPayload,
  extractError,
  parseModels,
  parseReport,
  type CheckModel,
  type Report,
} from "@/lib/citecheck";

export type CheckResult =
  { ok: true; report: Report } | { ok: false; error: string };

export type ModelResult =
  { ok: true; models: CheckModel[] } | { ok: false; error: string };

export type ExtractResult =
  { ok: true; text: string } | { ok: false; error: string };

const origin = process.env.CITECHECK_ORIGIN ?? "http://127.0.0.1:8000";

async function readDetail(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "detail" in body &&
      typeof body.detail === "string"
    ) {
      return body.detail;
    }
  } catch {
    return "";
  }
  return "";
}

export async function listModels(): Promise<ModelResult> {
  try {
    const response = await fetch(`${origin}/v1/models`, { cache: "no-store" });
    if (!response.ok) {
      return { ok: false, error: "The checker did not list its models." };
    }
    const models = parseModels(await response.json());
    if (!models) {
      return {
        ok: false,
        error: "The checker returned a model list this page cannot read.",
      };
    }
    return { ok: true, models };
  } catch {
    return {
      ok: false,
      error:
        "The checker is not running. Start it on this machine, then try again.",
    };
  }
}

/** Read a PDF into the brief box. Checking it is still checkBrief. */
export async function extractBrief(formData: FormData): Promise<ExtractResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: extractError("a PDF is required") };
  }
  const pages = formData.get("pages");
  const body = new FormData();
  body.set("file", file);
  if (typeof pages === "string" && pages.trim()) {
    body.set("pages", pages.trim());
  }

  try {
    const response = await fetch(`${origin}/v1/extract`, {
      method: "POST",
      body,
      cache: "no-store",
    });
    if (!response.ok) {
      return { ok: false, error: extractError(await readDetail(response)) };
    }
    const payload: unknown = await response.json();
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("text" in payload) ||
      typeof payload.text !== "string" ||
      !payload.text.trim()
    ) {
      return {
        ok: false,
        error: extractError("no text could be read from this PDF"),
      };
    }
    return { ok: true, text: payload.text };
  } catch {
    return {
      ok: false,
      error:
        "The checker is not running. Start it on this machine, then try again.",
    };
  }
}

/** One check per submit. Support stays off unless the person turns it on. */
export async function checkBrief(
  text: string,
  verdicts = false,
  model: string | null = null,
): Promise<CheckResult> {
  const brief = text.trim();
  if (!brief) return { ok: false, error: "Paste the text of a brief." };
  if (verdicts && !model) {
    return { ok: false, error: "Choose a model before asking for support." };
  }

  try {
    const response = await fetch(`${origin}/v1/check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(checkPayload(brief, verdicts, model)),
      cache: "no-store",
    });
    if (!response.ok) {
      const detail = await readDetail(response);
      return {
        ok: false,
        error:
          checkFailure(response.status, detail) ??
          "The checker did not accept that brief.",
      };
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
