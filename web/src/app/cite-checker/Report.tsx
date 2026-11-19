import {
  citeLabel,
  courtListenerUrl,
  groupCites,
  groupNeedsAttention,
  isProblemCite,
  looseQuotes,
  quoteLabel,
  quoteTone,
  verdictLabel,
  verdictTone,
  type Cite,
  type Quote,
  type Report,
  type Verdict,
} from "@/lib/citecheck";

function caseTitle(cite: Cite): string {
  if (cite.case_names.length > 0) return cite.case_names.join("; ");
  if (cite.plaintiff && cite.defendant) {
    return `${cite.plaintiff} v. ${cite.defendant}`;
  }
  return cite.text;
}

function CiteLinks({ cite }: { cite: Cite }) {
  if (cite.urls.length === 0) return null;
  const names = cite.case_names.length > 0 ? cite.case_names : [cite.text];
  return (
    <p className="mt-site-2">
      {cite.urls.map((url, index) => (
        <a
          key={url}
          href={courtListenerUrl(url)}
          className="mr-site-4"
          target="_blank"
          rel="noreferrer"
        >
          {names[index] ?? cite.text}
        </a>
      ))}
    </p>
  );
}

function StatusMark({
  label,
  tone,
}: {
  label: string;
  tone: "problem" | "fine" | "quiet";
}) {
  const className =
    tone === "problem"
      ? "bg-not-found-tint text-not-found shadow-[inset_2px_0_0_var(--not-found)]"
      : tone === "fine"
        ? "bg-found-tint text-found shadow-[inset_2px_0_0_var(--found)]"
        : "bg-unchecked-tint text-unchecked shadow-[inset_2px_0_0_var(--unchecked)]";
  return (
    <span
      className={`inline-flex rounded-site px-site-2 py-[0.15em] font-sans text-step-small font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function QuoteList({ quotes }: { quotes: Quote[] }) {
  if (quotes.length === 0) return null;
  return (
    <ul className="mt-site-3 list-none p-0">
      {quotes.map((quote) => {
        const tone = quoteTone(quote.status);
        return (
          <li key={quote.id} className="border-t border-rule py-site-3">
            <StatusMark
              label={quoteLabel(quote.status)}
              tone={
                tone === "problem"
                  ? "problem"
                  : tone === "fine"
                    ? "fine"
                    : "quiet"
              }
            />
            <blockquote className="mt-site-2 mb-0 font-serif">
              {quote.text}
            </blockquote>
            {quote.note ? <p className="mt-site-2">{quote.note}</p> : null}
            {quote.omits ? (
              <p className="mt-site-2 text-ink-soft">
                The quotation omits words.
              </p>
            ) : null}
            {quote.found_on.length > 0 ? (
              <p className="mt-site-2 text-ink-soft">
                Found on page {quote.found_on.join(", ")}.
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function CiteBlock({ cite, nested }: { cite: Cite; nested?: boolean }) {
  const problem = isProblemCite(cite.status);
  const title = caseTitle(cite);
  return (
    <div
      className={
        nested ? "mt-site-3 border-l border-rule pl-site-4" : undefined
      }
    >
      <div className="flex flex-wrap items-center gap-x-site-3 gap-y-site-2">
        <StatusMark
          label={citeLabel(cite.status)}
          tone={
            cite.status === "found" ? "fine" : problem ? "problem" : "quiet"
          }
        />
        <span className="font-serif text-step-1">{title}</span>
      </div>
      {title === cite.text ? null : (
        <p className="mt-site-2 text-ink-soft">{cite.text}</p>
      )}
      {cite.pin_pages.length > 0 ? (
        <p className="mt-site-1 text-ink-soft">
          Pin {cite.pin_pages.join(", ")}.
        </p>
      ) : null}
      {cite.note ? <p className="mt-site-2">{cite.note}</p> : null}
      <CiteLinks cite={cite} />
    </div>
  );
}

function VerdictList({ verdicts }: { verdicts: Verdict[] }) {
  if (verdicts.length === 0) return null;
  return (
    <ul className="mt-site-3 list-none p-0">
      {verdicts.map((verdict, index) => (
        <li
          key={`${verdict.cite_id}-${index}`}
          className="border-t border-rule py-site-3"
        >
          <StatusMark
            label={verdictLabel(verdict.verdict)}
            tone={verdictTone(verdict.verdict)}
          />
          <p className="mt-site-2 font-serif">{verdict.sentence}</p>
          {verdict.signal ? (
            <p className="mt-site-2 text-ink-soft">Signal: {verdict.signal}</p>
          ) : null}
          {verdict.evidence ? (
            <>
              <blockquote className="mt-site-2 mb-0 font-serif">
                {verdict.evidence}
              </blockquote>
              <p className="mt-site-2 text-ink-soft">
                Evidence score {verdict.score}.
                {verdict.score < 80
                  ? " The evidence was not found as a quotation."
                  : ""}
              </p>
            </>
          ) : null}
          {verdict.page ? (
            <p className="mt-site-2 text-ink-soft">
              Page {verdict.page}.{" "}
              {verdict.on_pin_page
                ? "That page is cited."
                : "That page is not a cited pin."}
            </p>
          ) : null}
          {verdict.reason ? (
            <p className="mt-site-2">{verdict.reason}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function GroupList({
  groups,
  verdicts,
}: {
  groups: ReturnType<typeof groupCites>;
  verdicts: Verdict[];
}) {
  return (
    <ul className="mt-site-4 list-none border-t border-rule p-0">
      {groups.map((group) => {
        return (
          <li key={group.cite.id} className="border-b border-rule py-site-4">
            <CiteBlock cite={group.cite} />
            <QuoteList
              quotes={group.quotes.filter(
                (quote) => quote.cite_id === group.cite.id,
              )}
            />
            <VerdictList
              verdicts={verdicts.filter(
                (verdict) => verdict.cite_id === group.cite.id,
              )}
            />
            {group.children.map((child) => (
              <div key={child.id}>
                <CiteBlock cite={child} nested />
                <QuoteList
                  quotes={group.quotes.filter(
                    (quote) => quote.cite_id === child.id,
                  )}
                />
                <VerdictList
                  verdicts={verdicts.filter(
                    (verdict) => verdict.cite_id === child.id,
                  )}
                />
              </div>
            ))}
          </li>
        );
      })}
    </ul>
  );
}

export function ReportView({ report }: { report: Report }) {
  if (
    report.cites.length === 0 &&
    report.quotes.length === 0 &&
    report.verdicts.length === 0
  ) {
    return <p>Nothing checkable was found.</p>;
  }

  const groups = groupCites(report);
  const problems = groups.filter(groupNeedsAttention);
  const rest = groups.filter((group) => !groupNeedsAttention(group));
  const loose = looseQuotes(report);
  const placed = new Set(report.cites.map((cite) => cite.id));
  const looseVerdicts = report.verdicts.filter(
    (verdict) => !placed.has(verdict.cite_id),
  );

  return (
    <div>
      {problems.length > 0 ? (
        <section>
          <h2 className="text-step-2">Problems</h2>
          <GroupList groups={problems} verdicts={report.verdicts} />
        </section>
      ) : null}
      {rest.length > 0 ? (
        <section className={problems.length > 0 ? "mt-site-7" : undefined}>
          <h2 className="text-step-2">Citations</h2>
          <GroupList groups={rest} verdicts={report.verdicts} />
        </section>
      ) : null}
      {loose.length > 0 ? (
        <section className="mt-site-7">
          <h2 className="text-step-2">Quotes without a citation</h2>
          <QuoteList quotes={loose} />
        </section>
      ) : null}
      {looseVerdicts.length > 0 ? (
        <section className="mt-site-7">
          <h2 className="text-step-2">Support</h2>
          <VerdictList verdicts={looseVerdicts} />
        </section>
      ) : null}
    </div>
  );
}
