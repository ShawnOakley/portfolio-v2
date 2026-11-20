function Node({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto w-full max-w-md rounded-site border border-rule bg-paper px-site-3 py-site-2 text-center font-mono text-step-small">
      {children}
    </p>
  );
}

function Down({ label }: { label?: string }) {
  return (
    <p className="py-site-1 text-center text-step-small text-ink-soft">
      <span aria-hidden="true">↓</span>
      {label ? <span className="mt-site-1 block">{label}</span> : null}
    </p>
  );
}

function Chain({ steps }: { steps: string[] }) {
  return (
    <div>
      {steps.map((step, index) => (
        <div key={step}>
          {index > 0 ? <Down /> : null}
          <Node>{step}</Node>
        </div>
      ))}
    </div>
  );
}

/** The citation check, read top to bottom. Forks sit side by side. */
export function CheckFlow() {
  return (
    <section className="wide mt-site-8" aria-labelledby="check-flow">
      <h2 id="check-flow" className="text-step-2">
        How a check runs
      </h2>
      <div className="mt-site-5 rounded-site border border-rule bg-paper-raised p-site-4 sm:p-site-5">
        <div className="grid items-start gap-site-6 lg:grid-cols-2">
          <div>
            <Node>Visitor</Node>
            <Down label="paste text, or drop a PDF" />
            <Node>Page process</Node>
          </div>
          <div>
            <Node>citecheck command</Node>
            <p className="mt-site-2 text-center text-step-small text-ink-soft">
              same check, brief, then CSV reports
            </p>
          </div>
        </div>

        <Down label="POST /v1/extract · POST /v1/check · GET /v1/models" />
        <Node>citecheck-api process</Node>
        <p className="mt-site-2 text-center text-step-small text-ink-soft">
          text for the brief box · cites, quotes, verdicts
        </p>

        <div className="mt-site-6 rounded-site border border-rule p-site-4">
          <h3 className="text-step-1">Inside one check</h3>
          <div className="mt-site-4 grid items-start gap-site-6">
            <Chain steps={["extract route", "pdf_to_text, then clean"]} />
            <Chain steps={["check route", "check_brief"]} />
          </div>
          <div className="mt-site-2 grid items-start gap-site-4 sm:grid-cols-2">
            <div>
              <Down label="only if verdicts is true" />
              <Chain
                steps={[
                  "check_verdicts",
                  "find_propositions",
                  "split the opinion, rank with BM25",
                ]}
              />
              <Down label="prompt, then one repair if the evidence is not a quote" />
              <Node>Supported model</Node>
            </div>
            <div>
              <Down />
              <Chain
                steps={[
                  "extract: eyecite, short forms, pinpoints",
                  "resolve: lookup, then inherit",
                  "fallback: search by case name",
                  "find_quotes",
                ]}
              />
            </div>
          </div>
          <p className="mt-site-4 text-center text-step-small text-ink-soft">
            check_verdicts locates that evidence in the opinion. find_quotes
            reaches the same step.
          </p>
          <Down />
          <Chain
            steps={[
              "check_quotes: locate and compare",
              "send: pace, retry, cache",
            ]}
          />
        </div>

        <Down label="citation-lookup, search, opinions" />
        <Node>CourtListener</Node>
      </div>
    </section>
  );
}
